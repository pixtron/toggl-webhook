import { EventFilter } from '../types.js';

export interface CreateSubscriptionParams {
  workspace_id: number
  url_callback: string
  event_filters: EventFilter[]
  description: string
  enabled?: boolean
  secret?: string
}

export interface UpdateSubscriptionParams extends CreateSubscriptionParams {
  subscription_id: number
}

export interface DeleteSubscriptionParams {
  workspace_id: number
  subscription_id: number
}

export interface ListSubscriptionsParams {
  workspace_id: number
}

export interface ListSubscriptionEventsParams {
  workspace_id: number
  subscription_id: number
  offset?: number
}

export interface PingSubscriptionParams {
  workspace_id: number
  subscription_id: number
}

export interface SetSubscriptionEnabledParams {
  workspace_id: number
  subscription_id:  number
  enabled: boolean
}
