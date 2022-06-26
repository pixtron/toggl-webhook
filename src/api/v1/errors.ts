export abstract class RequestError extends Error {
  public abstract readonly code: string;

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      stack: this.stack,
      code: this.code,
    }
  }
}

export class BadRequestError extends RequestError {
  public readonly code: string;

  constructor(message: string) {
    super(message)
    this.code = 'E_BAD_REQUEST';
    this.name = 'BadRequestError';
  }
}

export class NotFoundError extends RequestError {
  public readonly code: string;

  constructor(message: string) {
    super(message)
    this.code = 'E_NOT_FOUND';
    this.name = 'NotFoundError';
  }
}

export class ForbiddenError extends RequestError {
  public readonly code: string;

  constructor(message: string) {
    super(message)
    this.code = 'E_FORBIDDEN';
    this.name = 'ForbiddenError';
  }
}
