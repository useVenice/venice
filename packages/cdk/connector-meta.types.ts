import type {oas30, oas31} from 'openapi3-ts'

import {
  castIs,
  R,
  titleCase,
  urlFromImage,
  zodToJsonSchema,
} from '@usevenice/util'
import {z} from '@usevenice/zod'

import type {
  AnyConnectorImpl,
  ConnectorSchemas,
  ConnHelpers,
} from './connector.types'
import type {EndUserId, ExtEndUserId, ExternalId, Id} from './id.types'
import {zExternalId} from './id.types'
import type {NangoProvider} from './oauth/NangoClient'
import type {AnyEntityPayload, ResoUpdateData, Source} from './protocol'

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type JSONSchema = {} // ReturnType<typeof zodToJsonSchema> | JSONSchema7Definition

export const metaForConnector = (
  connector: AnyConnectorImpl,
  opts: {includeOas?: boolean} = {},
) => ({
  // ...connector,
  __typename: 'connector' as const,
  name: connector.name,
  displayName: connector.metadata?.displayName ?? titleCase(connector.name),
  logoUrl: connector.metadata?.logoSvg
    ? urlFromImage({type: 'svg', data: connector.metadata?.logoSvg})
    : connector.metadata?.logoUrl,
  stage: connector.metadata?.stage ?? 'alpha',
  platforms: connector.metadata?.platforms ?? ['cloud', 'local'],
  categories: connector.metadata?.categories ?? ['other'],
  supportedModes: R.compact([
    connector.sourceSync ? ('source' as const) : null,
    connector.destinationSync ? ('destination' as const) : null,
  ]),
  hasPreConnect: connector.preConnect != null,
  hasUseConnectHook: connector.useConnectHook != null,
  // TODO: Maybe nangoProvider be more explicit as a base provider?
  hasPostConnect:
    connector.postConnect != null || connector.metadata?.nangoProvider,
  nangoProvider: connector.metadata?.nangoProvider,
  schemas: R.mapValues(connector.schemas ?? {}, (schema) =>
    schema instanceof z.ZodSchema ? zodToJsonSchema(schema) : undefined,
  ) as Record<keyof ConnectorSchemas, JSONSchema>,
  openapiSpec: opts.includeOas ? connector.metadata?.openapiSpec : undefined,
})

// aka verticals
export const zConnectorVertical = z.enum([
  'banking',
  'accounting',
  'commerce',
  'expense-management',
  'enrichment',
  'database',
  'flat-files-and-spreadsheets',
  'streaming',
  'personal-finance',
  'other',
])

export const zConnectorStage = z.enum(['hidden', 'alpha', 'beta', 'ga'])

export type OpenApiSpec = oas30.OpenAPIObject | oas31.OpenAPIObject

export interface ConnectorMetadata {
  logoUrl?: string
  logoSvg?: string
  displayName?: string
  /** @deprecated way to indicate an integration outputs raw rather than standardized data */
  layer?: 'core' | 'ledger'
  platforms?: Array<'cloud' | 'local'>
  stage?: z.infer<typeof zConnectorStage>
  // labels?: Array<'featured' | 'banking' | 'accounting' | 'enrichment'>
  categories?: Array<z.infer<typeof zConnectorVertical>>

  openapiSpec?: {
    proxied?: OpenApiSpec
    original?: OpenApiSpec
  }

  /** Whether this is an oauth integration? */
  nangoProvider?: NangoProvider
}

// MARK: - Shared connect types

/** Useful for establishing the initial pipeline when creating a connection for the first time */

export type ConnectOptions = z.input<typeof zConnectOptions>
export const zConnectOptions = z.object({
  // userId: UserId,
  /** Noop if `connectionId` is specified */
  institutionExternalId: zExternalId.nullish(),
  resourceExternalId: zExternalId.nullish(),
})

export const zPostConnectOptions = zConnectOptions.extend({
  syncInBand: z.boolean().nullish(),
})

// MARK: - Client side connect types

export type OpenDialogFn = (
  Component: React.ComponentType<{close: () => void}>,
  options?: {
    dismissOnClickOutside?: boolean
    onClose?: () => void
  },
) => void

export type UseConnectHook<T extends ConnHelpers = ConnHelpers> = (scope: {
  openDialog: OpenDialogFn
}) => (
  connectInput: T['_types']['connectInput'],
  context: ConnectOptions & {
    // TODO: Does this belong here?
    connectorConfigId: Id['ccfg']
  },
) => Promise<T['_types']['connectOutput']>

// MARK: - Server side connect types

export interface CheckResourceContext {
  webhookBaseUrl: string
}

/** Context providers get during the connection establishing phase */
export interface ConnectContext<TSettings>
  extends Omit<ConnectOptions, 'resourceExternalId' | 'envName'>,
    CheckResourceContext {
  extEndUserId: ExtEndUserId
  /** Used for OAuth based integrations, e.g. https://plaid.com/docs/link/oauth/#create-and-register-a-redirect-uri */
  redirectUrl?: string
  resource?: {
    externalId: ExternalId
    settings: TSettings
  } | null
}

// TODO: We should rename `provider` to `integration` given that they are both
// Sources AND destinations. Provider only makes sense for sources.
// An integration can have `connect[UI]`, `src[Connector]` and `dest[Connector]`
export type CheckResourceOptions = z.infer<typeof zCheckResourceOptions>
export const zCheckResourceOptions = z.object({
  /**
   * Always make a request to the connector. Perhaps should be the default?
   * Will have to refactor `checkResource` to be a bit different
   */
  skipCache: z.boolean().nullish(),
  /** Persist input into connection storage */
  import: z.boolean().nullish(),
  /**
   * Update the webhook associated with this connection to based on webhookBaseUrl
   */
  updateWebhook: z.boolean().nullish(),
  /** Fire webhook for default data updates  */
  sandboxSimulateUpdate: z.boolean().nullish(),
  /** For testing out disconnection handling */
  sandboxSimulateDisconnect: z.boolean().nullish(),
})

/** Extra props not on ResoUpdateData */
export interface ResourceUpdate<
    TEntity extends AnyEntityPayload = AnyEntityPayload,
    TSettings = unknown,
  >
  // make `ResoUpdateData.id` not prefixed so we can have better inheritance
  extends Omit<ResoUpdateData<TSettings>, 'id'> {
  // Subset of resoUpdate
  resourceExternalId: ExternalId
  // Can we inherit types used by metaLinks?
  /** If missing it means do not change the userId... */
  endUserId?: EndUserId | null

  source$?: Source<TEntity>
  triggerDefaultSync?: boolean
}

export type WebhookInput = z.infer<typeof zWebhookInput>
export const zWebhookInput = z.object({
  headers: z
    .record(z.unknown())
    .refine(castIs<import('http').IncomingHttpHeaders>()),
  query: z.record(z.unknown()),
  body: z.unknown(),
})

export interface WebhookReturnType<
  TEntity extends AnyEntityPayload,
  TSettings,
> {
  resourceUpdates: Array<ResourceUpdate<TEntity, TSettings>>
  /** HTTP Response body */
  response?: {
    body: Record<string, unknown>
  }
}

export const zPassthroughInput = z.object({
  method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']),
  path: z.string(),
  query: z.record(z.unknown()).optional(),
  headers: z.record(z.unknown()).optional(),
  body: z.record(z.unknown()).optional(),
})
export type PassthroughInput = z.infer<typeof zPassthroughInput>
