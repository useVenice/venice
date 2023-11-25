import {R, titleCase, urlFromImage, zodToJsonSchema} from '@usevenice/util'
import {z} from '@usevenice/zod'
import type {AnyConnectorImpl, ConnectorSchemas} from './connector.types'

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type JSONSchema = {} // ReturnType<typeof zodToJsonSchema> | JSONSchema7Definition
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
  sourceStreams: connector.metadata?.sourceStreams,
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
  schemas: R.mapValues(connector.schemas ?? {}, (schema, type) => {
    try {
      return schema instanceof z.ZodSchema ? zodToJsonSchema(schema) : undefined
    } catch (err) {
      throw new Error(
        `Failed to convert schema for ${connector.name}.${type}: ${err}`,
      )
    }
  }) as Record<keyof ConnectorSchemas, JSONSchema>,
  openapiSpec: opts.includeOas ? connector.metadata?.openapiSpec : undefined,
})
