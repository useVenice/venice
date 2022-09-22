import React from 'react'
// Used to help the typechecker otherwise ts-match would complain about expression being infinitely deep...
import type {UseQueryResult} from 'react-query'

import type {ConnectOptions, Id} from '@ledger-sync/cdk-core'
import {CANCELLATION_TOKEN, extractId, zEnvName} from '@ledger-sync/cdk-core'
import type {
  AnySyncMutationInput,
  AnySyncQueryOutput,
  IntegrationInput,
} from '@ledger-sync/engine-backend'
import {z} from '@ledger-sync/util'

import {LSProvider} from './LSProvider'

export type UseLedgerSyncOptions = z.infer<typeof zUseLedgerSyncOptions>
export const zUseLedgerSyncOptions = z.object({
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
export function useLedgerSyncAdmin({
  ledgerIdKeywords,
}: {
  ledgerIdKeywords?: string
}) {
  // Add a context for if user is in developer mode...

  const {trpc, isAdmin, developerMode} = LSProvider.useContext()

  const integrationsRes = trpc.useQuery([
    'listIntegrations',
    {},
  ]) as UseQueryResult<AnySyncQueryOutput<'listIntegrations'>>

  const ledgerIdsRes = trpc.useQuery(
    ['adminSearchLedgerIds', {keywords: ledgerIdKeywords}],
    {enabled: isAdmin},
  ) as UseQueryResult<AnySyncQueryOutput<'adminSearchLedgerIds'>>
  const adminSyncMeta = trpc.useMutation('adminSyncMetadata')

  return {integrationsRes, ledgerIdsRes, adminSyncMeta, isAdmin, developerMode}
}

/**
 * Ledger-specific
 */
export function useLedgerSync({envName, keywords}: UseLedgerSyncOptions) {
  const {trpc, ledgerId, isAdmin, developerMode, queryClient} =
    LSProvider.useContext()
  const integrationsRes = trpc.useQuery([
    'listIntegrations',
    {},
  ]) as UseQueryResult<AnySyncQueryOutput<'listIntegrations'>>
  const connectionsRes = trpc.useQuery(['listConnections', {ledgerId}], {
    enabled: !!ledgerId,
    refetchInterval: 1 * 1000, // So we can refresh the syncInProgress indicator
  }) as UseQueryResult<AnySyncQueryOutput<'listConnections'>>
  const insRes = trpc.useQuery([
    'searchInstitutions',
    {keywords},
  ]) as UseQueryResult<AnySyncQueryOutput<'searchInstitutions'>>
  const syncConnection = trpc.useMutation('syncConnection')
  const deleteConnection = trpc.useMutation('deleteConnection', {
    onSettled: () => queryClient.invalidateQueries(['listConnections']),
  })
  const checkConnection = trpc.useMutation('checkConnection', {
    onSettled: () => queryClient.invalidateQueries(['listConnections']),
  })

  // Connect should return a shape similar to client.mutation such that
  // consumers can use the same pattern of hanlding loading and error...
  const connect = useLedgerSyncConnect({envName})

  return {
    ledgerId,
    connect,
    integrationsRes,
    connectionsRes,
    insRes,
    syncConnection,
    deleteConnection,
    checkConnection,
    isAdmin,
    developerMode,
  }
}

/** Also ledger-specific */
export function useLedgerSyncConnect({
  envName,
  lazyUserCreation,
}: UseLedgerSyncOptions) {
  const {
    connectFnMapRef,
    trpcClient: client,
    trpc,
    queryClient,
    ledgerId,
  } = LSProvider.useContext()
  const integrationsRes = trpc.useQuery([
    'listIntegrations',
    {},
  ]) as UseQueryResult<AnySyncQueryOutput<'listIntegrations'>>

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
    // TODO: we dont actually need ledgerId anymore
    // Maybe we can make trpcClient change ref when accessToken changes instead?
    if (!ledgerId || !envName || lazyUserCreation) {
      return
    }
    integrationsRes.data
      ?.map((int) => preConnOpts([{id: int.id}, {envName}]))
      // If we have been sitting on the page for 15 mins, can prefetch re-run automatically?
      // Or would that be a reason for useQueries instead?
      .forEach((options) => queryClient.prefetchQuery(options))
  }, [
    envName,
    ledgerId,
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
  //     preConnFetchOpts([{id: int.id}, {envName, ledgerId}]),
  //   ),
  // )

  // Connect should return a shape similar to client.mutation such that
  // consumers can use the same pattern of hanlding loading and error...
  // TODO: We should add something to know whether we are currently connecting in a global state
  // And if we are then return early
  const connect = React.useCallback(
    async function (
      int: IntegrationInput,
      _opts: {institutionId?: Id['ins']; connectionId?: Id['conn']},
    ) {
      if (!envName || !ledgerId) {
        console.log('Connect missing params, noop', {envName, ledgerId})
        return
      }

      const opt: ConnectOptions = {
        institutionExternalId: _opts.institutionId
          ? extractId(_opts.institutionId)[2]
          : undefined,
        connectionExternalId: _opts.connectionId
          ? extractId(_opts.connectionId)[2]
          : undefined,
        envName,
      }
      try {
        console.log(`[useLedgerSyncConnect] ${int.id} Will connect`)
        const preConnRes = await queryClient.fetchQuery(preConnOpts([int, opt]))
        console.log(
          `[useLedgerSyncConnect] ${int.id} preConnnectRes`,
          preConnRes,
        )

        const provider = extractId(int.id)[1]
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const res = await connectFnMapRef.current?.[provider]?.(preConnRes, opt)
        console.log(`[useLedgerSyncConnect] ${int.id} innerConnectRes`, res)

        const postConRes = await client.mutation('postConnect', [res, int, opt])
        console.log(
          `[useLedgerSyncConnect] ${int.id} postConnectRes`,
          postConRes,
        )

        void queryClient.invalidateQueries(['listConnections'])

        console.log(`[useLedgerSyncConnect] ${int.id} Did connect`)
      } catch (err) {
        if (err === CANCELLATION_TOKEN) {
          console.log(`[useLedgerSyncConnect] ${int.id} Cancelled`)
        } else {
          console.error(
            `[useLedgerSyncConnect] ${int.id} Connection failed`,
            err,
          )
        }
      }
    },
    [envName, ledgerId, connectFnMapRef, preConnOpts, queryClient, client],
  )
  return connect
}
