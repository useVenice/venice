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
  AnyIntegrationImpl,
  ConnectorSchemas,
  ConnHelpers,
} from './connector.types'
import type {EndUserId, ExtEndUserId, ExternalId, Id} from './id.types'
import {zExternalId} from './id.types'
import type {NangoProvider} from './oauth/NangoClient'
import type {AnyEntityPayload, ResoUpdateData, Source} from './protocol'

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type JSONSchema = {} // ReturnType<typeof zodToJsonSchema> | JSONSchema7Definition

export const metaForProvider = (
  provider: AnyIntegrationImpl,
  opts: {includeOas?: boolean} = {},
) => ({
  // ...provider,
  __typename: 'provider' as const,
  name: provider.name,
  displayName: provider.metadata?.displayName ?? titleCase(provider.name),
  logoUrl: provider.metadata?.logoSvg
    ? urlFromImage({type: 'svg', data: provider.metadata?.logoSvg})
    : provider.metadata?.logoUrl,
  stage: provider.metadata?.stage ?? 'alpha',
  platforms: provider.metadata?.platforms ?? ['cloud', 'local'],
  categories: provider.metadata?.categories ?? ['other'],
  supportedModes: R.compact([
    provider.sourceSync ? ('source' as const) : null,
    provider.destinationSync ? ('destination' as const) : null,
  ]),
  hasPreConnect: provider.preConnect != null,
  hasUseConnectHook: provider.useConnectHook != null,
  // TODO: Maybe nangoProvider be more explicit as a base provider?
  hasPostConnect:
    provider.postConnect != null || provider.metadata?.nangoProvider,
  nangoProvider: provider.metadata?.nangoProvider,
  schemas: R.mapValues(provider.schemas ?? {}, (schema) =>
    schema instanceof z.ZodSchema ? zodToJsonSchema(schema) : undefined,
  ) as Record<keyof ConnectorSchemas, JSONSchema>,
  openapiSpec: opts.includeOas ? provider.metadata?.openapiSpec : undefined,
})

// aka verticals
export const zIntegrationVertical = z.enum([
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

export const zIntegrationStage = z.enum(['hidden', 'alpha', 'beta', 'ga'])

export type OpenApiSpec = oas30.OpenAPIObject | oas31.OpenAPIObject

export interface IntegrationMetadata {
  logoUrl?: string
  logoSvg?: string
  displayName?: string
  /** @deprecated way to indicate an integration outputs raw rather than standardized data */
  layer?: 'core' | 'ledger'
  platforms?: Array<'cloud' | 'local'>
  stage?: z.infer<typeof zIntegrationStage>
  // labels?: Array<'featured' | 'banking' | 'accounting' | 'enrichment'>
  categories?: Array<z.infer<typeof zIntegrationVertical>>

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
    integrationId: Id['int']
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
   * Always make a request to the provider. Perhaps should be the default?
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
