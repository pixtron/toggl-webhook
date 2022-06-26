import got, {
  HTTPError,
  Method,
  OptionsOfJSONResponseBody,
} from 'got';

import { BadRequestError, ForbiddenError, NotFoundError } from './errors.js';
import { TogglWebhookClientOptions } from './types.js';

export class TogglHttpClient {
  protected baseUrl = 'https://track.toggl.com/webhooks/api/v1/';
  protected apiToken: string;
  protected userAgent: string;

  constructor(options: TogglWebhookClientOptions) {
    this.apiToken = options.apiToken;
    this.userAgent = options.userAgent || 'node toggl-webhook';
  }

  public async get<T>(
    endpoint: string,
    searchParams?: URLSearchParams,
  ): Promise<T> {
    return this.dispatchRequest<T>(endpoint, 'GET', searchParams)
  }

  public async post<T>(
    endpoint: string,
    json?: unknown,
    searchParams?: URLSearchParams,
  ): Promise<T> {
    return this.dispatchRequest<T>(endpoint, 'POST', searchParams, json);
  }

  public async put<T>(
    endpoint: string,
    json?: unknown,
    searchParams?: URLSearchParams,
  ): Promise<T> {
    return this.dispatchRequest<T>(endpoint, 'PUT', searchParams, json);
  }

  public async patch<T>(
    endpoint: string,
    json?: unknown,
    searchParams?: URLSearchParams,
  ): Promise<T> {
    return this.dispatchRequest<T>(endpoint, 'PATCH', searchParams, json);
  }

  public async delete<T>(
    endpoint: string,
    searchParams?: URLSearchParams,
  ): Promise<T> {
    return this.dispatchRequest<T>(endpoint, 'DELETE', searchParams);
  }

  protected async dispatchRequest<T>(
    endpoint: string,
    method: Method,
    searchParams?: URLSearchParams,
    json?: unknown,
  ): Promise<T> {
    const options: OptionsOfJSONResponseBody = {
      method,
      url: endpoint,
      searchParams,
      prefixUrl: this.baseUrl,
      retry: { limit: 0 },
      username: this.apiToken,
      password: 'api_token',
      responseType: 'json',
      headers: {
        'user-agent': this.userAgent,
      }
    };

    if (['POST', 'PATCH', 'PUT'] && json) {
      options.json = json;
    }

    try {
      const { body } = await got<T>(options);

      return body;
    } catch (err: unknown) {
      if (err instanceof HTTPError) {
        const { body, statusCode } = err.response;
        const message = typeof body === 'string' ?
          body : err.message;

        switch (statusCode) {
          case 400:
            throw new BadRequestError(message);
          case 403:
            throw new ForbiddenError(message);
          case 404:
            throw new NotFoundError(message);
        }
      }

      throw err;
    }
  }
}
