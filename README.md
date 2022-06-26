# toggl-webhook

This module provides a wrapper for the [toggl track webhook api](https://developers.track.toggl.com/docs/webhooks_start).


## Install

```
npm install --save toggl-webhook
```

*Warning*: This package is native [ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) and does not provide a CommonJS export. If your project uses CommonJS, you'll have to [convert to ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c) or use the dynamic import() function. Please don't open issues for questions regarding CommonJS / ESM.


## Usage

```
import { TogglWebhookClient } from 'toggl-webhook';

const client = new TogglWebhookClient({
  apiToken: 'XXX',
  userAgent: 'bob@example.com'
});

const subscription = await client.createSubscription({
  workspace_id: 10000,
  url_callback: 'https://example.com/hook',
  event_filters: [{entity: 'project', action: 'create'}],
  description: 'unique subscription description',
  secret: 'shhhh',
  enabled: true
});
```
