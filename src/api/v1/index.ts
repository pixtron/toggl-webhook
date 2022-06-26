import { TogglHttpClient } from './client.js';

import {
  TogglWebhookClientOptions,
  ListEventFiltersResponse,
  ListSubscriptionEventsResponse,
  PingSubscriptionResponse,
  ServerStatusResponse,
  Subscription
} from './types.js';

import {
  CreateSubscriptionParams,
  DeleteSubscriptionParams,
  ListSubscriptionsParams,
  ListSubscriptionEventsParams,
  PingSubscriptionParams,
  SetSubscriptionEnabledParams,
  UpdateSubscriptionParams,
} from './schemas/types.js';

import validate from './validate.js';

export class TogglWebhookClient {
  private client: TogglHttpClient;

  constructor(options: TogglWebhookClientOptions) {
    this.client = new TogglHttpClient(options);
  }

  /**
   * @see https://developers.track.toggl.com/docs/webhooks/subscriptions#delete-remove-existing-subscription
   */
  listEventFilters(): Promise<ListEventFiltersResponse> {
    return this.client.get<ListEventFiltersResponse>('event_filters');
  }

  /**
   * @see https://developers.track.toggl.com/docs/webhooks/subscriptions#get-retrieves-existings-subscriptions-for-the-requested-workspace-id
   */
  listSubscriptions(params: ListSubscriptionsParams): Promise<Subscription[]> {
    validate('ListSubscriptionsParams', params);

    const { workspace_id } = params;
    return this.client.get<Subscription[]>(`subscriptions/${workspace_id}`);
  }

  /**
   * @see https://developers.track.toggl.com/docs/webhooks/subscriptions#post-creates-a-subscription
   */
  createSubscription(
    params: CreateSubscriptionParams
  ): Promise<Subscription> {
    validate('CreateSubscriptionParams', params);

    const { workspace_id, ...subscription } = params;

    return this.client.post<Subscription>(
      `subscriptions/${workspace_id}`,
      subscription
    );
  }

  /**
   * @see https://developers.track.toggl.com/docs/webhooks/subscriptions#put-update-existing-subscription
   */
  updateSubscription(
    params: UpdateSubscriptionParams
  ): Promise<Subscription> {
    validate('UpdateSubscriptionParams', params);

    const { workspace_id, subscription_id, ...subscription } = params;

    return this.client.put<Subscription>(
      `subscriptions/${workspace_id}/${subscription_id}`,
      subscription
    );
  }

  /**
   * @see https://developers.track.toggl.com/docs/webhooks/subscriptions#delete-remove-existing-subscription
   */
  setSubscriptionEnabled(
    params: SetSubscriptionEnabledParams
  ): Promise<Subscription> {
    validate('SetSubscriptionEnabledParams', params);

    const { workspace_id, subscription_id, enabled } = params;

    return this.client.patch<Subscription>(
      `subscriptions/${workspace_id}/${subscription_id}`, { enabled }
    );
  }

  /**
   * @see https://developers.track.toggl.com/docs/webhooks/subscriptions#delete-remove-existing-subscription
   */
  deleteSubscription(
    params: DeleteSubscriptionParams
  ): Promise<Subscription> {
    validate('DeleteSubscriptionParams', params);

    const { workspace_id, subscription_id } = params;

    return this.client.delete<Subscription>(
      `subscriptions/${workspace_id}/${subscription_id}`
    );
  }

  /**
   * @see https://developers.track.toggl.com/docs/webhooks/ping#post-sends-test-payload-to-subscriptions-callback-url
   */
  pingSubscription(
    params: PingSubscriptionParams
  ): Promise<PingSubscriptionResponse> {
    validate('PingSubscriptionParams', params);

    const { workspace_id, subscription_id } = params;

    return this.client.post<PingSubscriptionResponse>(
      `ping/${workspace_id}/${subscription_id}`
    );
  }

  /**
   * @see https://developers.track.toggl.com/docs/webhooks/events#get-retrieves-existings-events-for-the-requested-subscription-id
   */
  listSubscriptionEvents(
    params: ListSubscriptionEventsParams
  ): Promise<ListSubscriptionEventsResponse> {
    validate('ListSubscriptionEventsParams', params);

    const { workspace_id, subscription_id, offset } = params;

    const query: URLSearchParams = new URLSearchParams();
    if (offset) query.append('offset', offset+'');

    return this.client.get<ListSubscriptionEventsResponse>(
      `subscriptions/${workspace_id}/${subscription_id}/events`,
      query
    );
  }

  /**
   * @see https://developers.track.toggl.com/docs/webhooks/status#get-retrieve-the-webhooks-server-status
   */
  serverStatus(): Promise<ServerStatusResponse> {
    return this.client.get<ServerStatusResponse>(`status`);
  }
}
