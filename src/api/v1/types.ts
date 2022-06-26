export interface TogglWebhookClientOptions {
  /**
   * toggl API Token
   *
   * @see https://track.toggl.com/profile
   */
  readonly apiToken: string

  /**
   * User-Agetn to send with every request
   *
   * @default node toggl-webhook
   */
  readonly userAgent?: string
}

export type EventAction = 'created' | 'updated' | 'deleted'

export type EventFilter = {
  entity: string
  action: '*' | EventAction
}

export interface ListEventFiltersResponse {
  [key: string]: EventAction[]
}

export interface ListSubscriptionEventsResponse {
  total: number
  events: SubscriptionEvent[]
}

export interface PingSubscriptionResponse { status: string }

export interface ServerStatusResponse { status: string }

export interface Subscription {
  subscription_id: number
  workspace_id: number
  user_id: number
  enabled: boolean
  description: string
  event_filters: EventFilter[]
  url_callback: string
  secret: string
  validated_at: null | string
  has_pending_events: boolean
  created_at: string
  updated_at?: string
  deleted_at?: string
}

export interface SubscriptionEvent {
  event_id: number
  created_at: string
  creator_id: number
  metadata: SubscriptionEventMetadata
  payload: Record<string, unknown>
  consumer_id: number
  last_delivery_attempt: null | string
  last_delivery_error: null | string
  failed_delivery_attempts: number
}

export interface SubscriptionEventMetadata {
  action: EventAction
  event_user_id: string
  model: string
  path: string
  request_type: string
  [key: string]: string
}
