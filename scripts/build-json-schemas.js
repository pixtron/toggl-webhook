// adapted from https://dev.to/rehanvdm/typescript-type-safety-with-ajv-standalone-4861

import path from 'node:path';
import fs from 'node:fs';
import { promisify }  from 'node:util';
import { exec } from 'node:child_process';

import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import esbuild from 'esbuild';
import standaloneCode from 'ajv/dist/standalone/index.js';
import tsj from 'ts-json-schema-generator';

const execCommand = promisify(exec);

const [ , __filename, task = 'build'] = process.argv;
const __dirname = path.dirname(__filename);

const validationFileName = 'validations';

const srcConfig = {
  path: path.join(__dirname, "../src/api/v1/schemas/types.ts"),
  tsconfig: path.join(__dirname, "../tsconfig.json"),
  type: "*",
};

const dstConfig = {
  validationFile: path.join(__dirname, '/../src/api/v1/schemas/', `${validationFileName}.js`),
  validationFileTypes: path.join(__dirname, '/../src/api/v1/schemas/', `${validationFileName}.d.ts`),
  validationFileDistDir: path.join(__dirname, '/../dist/api/v1/schemas/'),
}

function typeScriptToJsonSchema() {
  let schemas = [];

  let schemaRaw = tsj.createGenerator(srcConfig).createSchema(srcConfig.type);

  let schema = JSON.parse(JSON.stringify(schemaRaw).replace(/#\/definitions\//gm, ''));

  for (let [id, definition] of Object.entries(schema.definitions)) {
    let singleTypeDefinition = {
      "$id": id,
      "$schema": "http://json-schema.org/draft-07/schema#",
      ...definition,
    };

    schemas.push(singleTypeDefinition);
  }

  return schemas;
}

function compileAjvStandalone(schemas) {
  const ajv = new Ajv({schemas: schemas, code: {source: true, esm: true}});

  addFormats(ajv);

  let moduleCode = standaloneCode(ajv);

  fs.writeFileSync(dstConfig.validationFile, moduleCode);
}

async function generateTypings() {
  const validationFile = dstConfig.validationFile;

  await execCommand(
    `${path.join(__dirname, '../node_modules/.bin/tsc')} -allowJs --declaration --emitDeclarationOnly ${validationFile}`
  );
}

function esBuildCommonToEsm() {
  esbuild.buildSync({
    // minify: true,
    bundle: true,
    target: ["node14"],
    keepNames: true,
    platform: 'node',
    format: "esm",
    entryPoints: [dstConfig.validationFile],
    outfile: dstConfig.validationFile,
    allowOverwrite: true
  });
}

async function build() {
  let schemas = typeScriptToJsonSchema();

  compileAjvStandalone(schemas);

  esBuildCommonToEsm();

  await generateTypings();
}

function copyToDist() {
  if (fs.existsSync(dstConfig.validationFileDistDir)) {
    fs.copyFileSync(dstConfig.validationFile, path.join(dstConfig.validationFileDistDir, `${validationFileName}.js`))
    fs.copyFileSync(dstConfig.validationFileTypes, path.join(dstConfig.validationFileDistDir, `${validationFileName}.d.ts`))
  }
}

switch (task) {
  case 'build':
    build();
  break;
  case 'copy':
    copyToDist();
  break;
  default:
    console.error(`unknown task "${task}".`)
  break;
}
