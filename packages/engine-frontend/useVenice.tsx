import React from 'react'
// Used to help the typechecker otherwise ts-match would complain about expression being infinitely deep...

import type {ConnectOptions, ConnectWith, Id} from '@usevenice/cdk-core'
import {CANCELLATION_TOKEN, extractId, zEnvName} from '@usevenice/cdk-core'
import type {IntegrationInput} from '@usevenice/engine-backend'
import {z} from '@usevenice/util'

import {createTRPCClientProxy} from '@trpc/client'
import {VeniceProvider} from './VeniceProvider'

export type UseVeniceOptions = z.infer<typeof zUseVeniceOptions>
export const zUseVeniceOptions = z.object({
  envName: zEnvName,
  /**
   * Wait to create concept of user / customer in service providers
   * until the last possible moment. Otherwise preConnect will be eagerly called
   * as soon as user loads the webpage which could end up creating a bunch of entities
   * such as StripeCustomer, YodleeUser that never have any material amount of data.
   *
   * TODO: Implement me...
   */
  lazyPreConnect: z.boolean().nullish(),
  /** When searching for for institution  */
  keywords: z.string().nullish(),
})

/** Non ledger-specific */
export function useVeniceAdmin({
  creatorIdKeywords,
}: {
  creatorIdKeywords?: string
}) {
  // Add a context for if user is in developer mode...

  const {trpc, isAdmin, userId, developerMode} = VeniceProvider.useContext()

  const integrationsRes = trpc.listIntegrations.useQuery(
    {},
    {enabled: !!userId},
  )

  const creatorIdsRes = trpc.adminSearchCreatorIds.useQuery(
    {keywords: creatorIdKeywords},
    {enabled: isAdmin},
  )
  const adminSyncMeta = trpc.adminSyncMetadata.useMutation()

  return {integrationsRes, creatorIdsRes, adminSyncMeta, isAdmin, developerMode}
}

export type UseVenice = ReturnType<typeof useVenice>

/**
 * Ledger-specific
 */
export function useVenice({envName, keywords}: UseVeniceOptions) {
  const {trpc, userId, isAdmin, developerMode, queryClient} =
    VeniceProvider.useContext()
  const integrationsRes = trpc.listIntegrations.useQuery(
    {},
    {enabled: !!userId, staleTime: 15 * 60 * 1000},
  )
  const resourcesRes = trpc.listResources.useQuery(
    {},
    // refetchInterval: 1 * 1000, // So we can refresh the syncInProgress indicator
    {enabled: !!userId},
  )
  const insRes = trpc.searchInstitutions.useQuery(
    {keywords},
    {
      enabled: !!userId,
    },
  )
  const syncResource = trpc.syncResource.useMutation()
  const deleteResource = trpc.deleteResource.useMutation({
    onSettled: () => queryClient.invalidateQueries(['listResources']),
  })
  const checkResource = trpc.checkResource.useMutation({
    onSettled: () => queryClient.invalidateQueries(['listResources']),
  })

  // Connect should return a shape similar to client.mutation such that
  // consumers can use the same pattern of hanlding loading and error...
  const connect = useVeniceConnect({envName})

  return {
    userId,
    connect,
    integrationsRes,
    resourcesRes,
    insRes,
    syncResource,
    deleteResource,
    checkResource,
    isAdmin,
    developerMode,
  }
}

/** Also ledger-specific */
export function useVeniceConnect({envName}: UseVeniceOptions) {
  const {
    connectFnMapRef,
    trpcClient: _client,
    trpc,
    queryClient,
    userId,
  } = VeniceProvider.useContext()
  // Move this inside the context
  const client = React.useMemo(() => createTRPCClientProxy(_client), [_client])
  const ctx = trpc.useContext()

  // Connect should return a shape similar to client.mutation such that
  // consumers can use the same pattern of hanlding loading and error...
  // TODO: We should add something to know whether we are currently connecting in a global state
  // And if we are then return early

  const connect = React.useCallback(
    async function (
      int: IntegrationInput,
      _opts: {
        resourceId?: Id['reso']
        /** For exsting Existing resource Id */
        /** Optional for new resource */
        institutionId?: Id['ins']
        /** For creating initial pipeline in new resource */
        connectWith?: ConnectWith
      },
    ) {
      console.log('[useVeniceConnect] _connect')
      if (!envName || !userId) {
        console.log('[useVeniceConnect] Connect missing params, noop', {
          envName,
          userId,
        })
        return
      }

      const opt: ConnectOptions = {
        institutionExternalId: _opts.institutionId
          ? extractId(_opts.institutionId)[2]
          : undefined,
        resourceExternalId: _opts.resourceId
          ? extractId(_opts.resourceId)[2]
          : undefined,
        envName,
      }
      try {
        console.log(`[useVeniceConnect] ${int.id} Will connect`)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const preConnRes = await ctx.preConnect.fetch([int, opt], {
          staleTime: 15 * 60 * 1000, // Good for 15 minutes
        })
        console.log(`[useVeniceConnect] ${int.id} preConnnectRes`, preConnRes)

        const provider = extractId(int.id)[1]
        const res: unknown = await connectFnMapRef.current?.[provider]?.(
          preConnRes,
          opt,
        )
        console.log(`[useVeniceConnect] ${int.id} innerConnectRes`, res)

        const postConRes = await client.postConnect.mutate([
          res,
          int,
          {...opt, connectWith: _opts.connectWith},
        ])
        console.log(`[useVeniceConnect] ${int.id} postConnectRes`, postConRes)

        void queryClient.invalidateQueries(['listResources'])

        console.log(`[useVeniceConnect] ${int.id} Did connect`)
      } catch (err) {
        if (err === CANCELLATION_TOKEN) {
          console.log(`[useVeniceConnect] ${int.id} Cancelled`)
        } else {
          console.error(`[useVeniceConnect] ${int.id} Connect failed`, err)
        }
      }
    },
    [
      envName,
      userId,
      ctx.preConnect,
      connectFnMapRef,
      client.postConnect,
      queryClient,
    ],
  )
  return connect
}
