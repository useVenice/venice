import type {AnyIntegrationImpl, Id, LinkFactory} from '@usevenice/cdk'
import {z} from '@usevenice/util'

// MARK: - Input types

type _inferInput<T> = T extends z.ZodTypeAny ? z.input<T> : never

// Would be nice to improve the typing of this... Make stuff non-optional
/** https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types */
export type IntegrationInput<
  T extends AnyIntegrationImpl = AnyIntegrationImpl,
> = T extends AnyIntegrationImpl
  ? {
      id: Id<T['name']>['int']
      config?: Partial<_inferInput<T['schemas']['integrationConfig']>>
    }
  : never

// Is there a way to infer this? Or would that be too much?
export type ResourceInput<T extends AnyIntegrationImpl = AnyIntegrationImpl> =
  T extends AnyIntegrationImpl
    ? {
        id: Id<T['name']>['reso']
        integrationId?: Id<T['name']>['int']
        integration?: IntegrationInput<T>
        settings?: Partial<_inferInput<T['schemas']['resourceSettings']>> &
          object
      }
    : never

export interface PipelineInput<
  PSrc extends AnyIntegrationImpl = AnyIntegrationImpl,
  PDest extends AnyIntegrationImpl = AnyIntegrationImpl,
  TLinks extends Record<string, LinkFactory> = {},
> {
  id: Id['pipe']
  source?: PSrc extends AnyIntegrationImpl ? ResourceInput<PSrc> : never
  sourceState?: PSrc extends AnyIntegrationImpl
    ? Partial<_inferInput<PSrc['schemas']['sourceState']>>
    : never
  destination?: PDest extends AnyIntegrationImpl ? ResourceInput<PDest> : never
  destinationState?: PDest extends AnyIntegrationImpl
    ? Partial<_inferInput<PDest['schemas']['destinationState']>>
    : never
  /** Used to initialize links */
  linkOptions?: Array<
    // prettier-ignore
    {
      [K in Extract<keyof TLinks, string>]: undefined extends Parameters<TLinks[K]>[0]
        ? [name: K, args: Parameters<TLinks[K]>[0]] | [name: K] | K
        : [name: K, args: Parameters<TLinks[K]>[0]]
    }[Extract<keyof TLinks, string>]
  >
  watch?: boolean
}

export const zSyncOptions = z.object({
  /** Only sync resource metadata and skip pipelines */
  metaOnly: z.boolean().nullish(),
  /**
   * Remove `state` of resource and trigger a full resync
   */
  fullResync: z.boolean().nullish(),

  /**
   * Triggers provider to refresh data from its source
   * https://plaid.com/docs/api/products/transactions/#transactionsrefresh
   * This may also load historical transactions. For example,
   * Finicity treats historical transaction as premium service.
   */
  todo_upstreamRefresh: z.boolean().nullish(),

  // See coda's implmementation. Requires adding a new message to the sync protocol
  // to remove all data from a particular source_id
  todo_removeUnsyncedData: z.boolean().nullish(),
})
