import React from 'react'
// Used to help the typechecker otherwise ts-match would complain about expression being infinitely deep...
import type {UseQueryResult} from 'react-query'

import type {ConnectOptions, ConnectWith, Id} from '@usevenice/cdk-core'
import {CANCELLATION_TOKEN, extractId, zEnvName} from '@usevenice/cdk-core'
import type {
  AnySyncMutationInput,
  AnySyncQueryOutput,
  IntegrationInput,
} from '@usevenice/engine-backend'
import {z} from '@usevenice/util'

import {VeniceProvider} from './VeniceProvider'

export type UseVeniceOptions = z.infer<typeof zUseVeniceOptions>
export const zUseVeniceOptions = z.object({
  envName: zEnvName,
  /**
   * Wait to create concept of user / customer in service providers
   * until the last possible moment. Otherwise preConnect will be eagerly called
   * as soon as user loads the webpage which could end up creating a bunch of entities
   * such as StripeCustomer, YodleeUser that never have any material amount of data.
   */
  lazyUserCreation: z.boolean().nullish(),
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

  const integrationsRes = trpc.useQuery(['listIntegrations', {}], {
    enabled: !!userId,
  }) as UseQueryResult<AnySyncQueryOutput<'listIntegrations'>>

  const creatorIdsRes = trpc.useQuery(
    ['adminSearchCreatorIds', {keywords: creatorIdKeywords}],
    {enabled: isAdmin},
  ) as UseQueryResult<AnySyncQueryOutput<'adminSearchCreatorIds'>>
  const adminSyncMeta = trpc.useMutation('adminSyncMetadata')

  return {integrationsRes, creatorIdsRes, adminSyncMeta, isAdmin, developerMode}
}

/**
 * Ledger-specific
 */
export function useVenice({envName, keywords}: UseVeniceOptions) {
  const {trpc, userId, isAdmin, developerMode, queryClient} =
    VeniceProvider.useContext()
  const integrationsRes = trpc.useQuery(['listIntegrations', {}], {
    enabled: !!userId,
  }) as UseQueryResult<AnySyncQueryOutput<'listIntegrations'>>
  const resourcesRes = trpc.useQuery(['listResources', {}], {
    enabled: !!userId,
    // refetchInterval: 1 * 1000, // So we can refresh the syncInProgress indicator
  }) as UseQueryResult<AnySyncQueryOutput<'listResources'>>
  const insRes = trpc.useQuery(['searchInstitutions', {keywords}], {
    enabled: !!userId,
  }) as UseQueryResult<AnySyncQueryOutput<'searchInstitutions'>>
  const syncResource = trpc.useMutation('syncResource')
  const deleteResource = trpc.useMutation('deleteResource', {
    onSettled: () => queryClient.invalidateQueries(['listResources']),
  })
  const checkResource = trpc.useMutation('checkResource', {
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
export function useVeniceConnect({
  envName,
  lazyUserCreation,
}: UseVeniceOptions) {
  const {
    connectFnMapRef,
    trpcClient: client,
    trpc,
    queryClient,
    userId,
  } = VeniceProvider.useContext()
  const integrationsRes = trpc.useQuery(['listIntegrations', {}], {
    enabled: !!userId,
  }) as UseQueryResult<AnySyncQueryOutput<'listIntegrations'>>

  const preConnOpts = React.useCallback(
    (
      input: AnySyncMutationInput<'preConnect'>,
    ): NonNullable<Parameters<typeof queryClient.fetchQuery>[2]> => ({
      queryKey: ['preConnect', input],
      queryFn: async ({queryKey, ...rest}) => {
        console.log('preConnQueryFn', queryKey, rest)
        // "mutation" because preConnect can have side effects such as causing `user` to be registered
        // This is used by prefetchQuery though afaik only query results may be cached by react-query
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
        return client.mutation(queryKey[0] as any, queryKey[1] as any)
      },
      staleTime: 15 * 60 * 1000, // This should be provider dependent
      // in particular dependent on the response from preConnect.
      // Plaid link token expires in ~4 hours, while yodlee access token expires in
      // ~30 mins. The expireAt are both within the token itself.
    }),
    [client, queryClient],
  )

  React.useEffect(() => {
    // TODO: we dont actually need userId anymore
    // Maybe we can make trpcClient change ref when accessToken changes instead?
    if (!userId || !envName || lazyUserCreation) {
      return
    }
    integrationsRes.data
      ?.map((int) => preConnOpts([{id: int.id}, {envName}]))
      // If we have been sitting on the page for 15 mins, can prefetch re-run automatically?
      // Or would that be a reason for useQueries instead?
      .forEach((options) => queryClient.prefetchQuery(options))
  }, [
    envName,
    userId,
    integrationsRes.data,
    preConnOpts,
    queryClient,
    lazyUserCreation,
  ])
  // Alternatively... unfortunate... No trpc.useQueries https://github.com/trpc/trpc/issues/1454
  // One downside is we will have ot add react-query as a direct dependency, which might be fine...
  // @yenbekbay is prefetch better or useQueries better?
  // useQueries(
  //   (integrationsRes.data ?? []).map((int) =>
  //     preConnFetchOpts([{id: int.id}, {envName, userId}]),
  //   ),
  // )

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
      if (!envName || !userId) {
        console.log('Connect missing params, noop', {envName, userId})
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
        const preConnRes = await queryClient.fetchQuery(preConnOpts([int, opt]))
        console.log(`[useVeniceConnect] ${int.id} preConnnectRes`, preConnRes)

        const provider = extractId(int.id)[1]
        const res: unknown = await connectFnMapRef.current?.[provider]?.(
          preConnRes,
          opt,
        )
        console.log(`[useVeniceConnect] ${int.id} innerConnectRes`, res)

        const postConRes = await client.mutation('postConnect', [
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
    [envName, userId, connectFnMapRef, preConnOpts, queryClient, client],
  )
  return connect
}
