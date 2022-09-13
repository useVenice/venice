import React from 'react'

import type {
  ConnectContextInput,
  UseLedgerSyncOptions,
} from '@ledger-sync/cdk-core'
import {CANCELLATION_TOKEN, extractId} from '@ledger-sync/cdk-core'
import type {
  IntegrationInput,
  makeSyncEngine,
} from '@ledger-sync/engine-backend'
import {type inferProcedureInput} from '@ledger-sync/engine-backend'

import {LSProvider} from './LSProvider'

export type LedgerSyncRouter = ReturnType<typeof makeSyncEngine>[1]
export type LedgerSyncPreConnectInput = inferProcedureInput<
  LedgerSyncRouter['_def']['queries']['preConnect']
>

/** Non ledger-specific */
export function useLedgerSyncAdmin({
  ledgerIdKeywords,
}: {
  ledgerIdKeywords?: string
}) {
  // Add a context for if user is in developer mode...

  const {trpc} = LSProvider.useContext()
  const integrationsRes = trpc.useQuery(['listIntegrations', [{}]])

  const ledgerIdsRes = trpc.useQuery([
    'adminSearchLedgerIds',
    [{keywords: ledgerIdKeywords}],
  ])
  const adminSyncMeta = trpc.useMutation('adminSyncMetadata')

  return {integrationsRes, ledgerIdsRes, adminSyncMeta}
}

/**
 * Ledger-specific
 */
export function useLedgerSync({
  ledgerId,
  envName,
  keywords,
}: UseLedgerSyncOptions) {
  console.log('[useLedgerSync]', {ledgerId, envName, keywords})
  // There has to be a shorthand for this...

  const {trpc} = LSProvider.useContext()
  const integrationsRes = trpc.useQuery(['listIntegrations', [{}]])
  const connectionsRes = trpc.useQuery(['listConnections', [{ledgerId}]], {
    enabled: !!ledgerId,
    // refetchInterval: 1 * 1000, // So we can refresh the syncInProgress indicator
  })
  const insRes = trpc.useQuery(['searchInstitutions', [{keywords}]])
  const syncConnection = trpc.useMutation('syncConnection')
  const deleteConnection = trpc.useMutation('deleteConnection')

  // Connect should return a shape similar to client.mutation such that
  // consumers can use the same pattern of hanlding loading and error...
  const connect = useLedgerSyncConnect({ledgerId, envName})

  return {
    connect,
    integrationsRes,
    connectionsRes,
    insRes,
    syncConnection,
    deleteConnection,
  }
}

/** Also ledger-specific */
export function useLedgerSyncConnect({
  ledgerId,
  envName,
}: UseLedgerSyncOptions) {
  console.log('[useLedgerSyncConnect]', {ledgerId, envName})
  // There has to be a shorthand for this...

  const {hooks, trpcClient: client, trpc, queryClient} = LSProvider.useContext()
  const integrationsRes = trpc.useQuery(['listIntegrations', [{}]])

  const preConnOpts = React.useCallback(
    (
      input: LedgerSyncPreConnectInput,
    ): NonNullable<Parameters<typeof queryClient.fetchQuery>[2]> => ({
      queryKey: ['preConnect', input],
      queryFn: async ({queryKey, ...rest}) => {
        console.log('preConnQueryFn', queryKey, rest)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
        return client.query(queryKey[0] as any, queryKey[1] as any)
      },
      staleTime: 15 * 60 * 1000, // This should be provider dependent
      // in particular dependent on the response from preConnect.
      // Plaid link token expires in ~4 hours, while yodlee access token expires in
      // ~30 mins. The expireAt are both within the token itself.
    }),
    [client, queryClient],
  )

  React.useEffect(() => {
    integrationsRes.data
      ?.map((int) => preConnOpts([{id: int.id}, {envName, ledgerId}]))
      // If we have been sitting on the page for 15 mins, can prefetch re-run automatically?
      // Or would that be a reason for useQueries instead?
      .forEach((options) => queryClient.prefetchQuery(options))
  }, [envName, ledgerId, integrationsRes.data, preConnOpts, queryClient])

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
  const connect = React.useCallback(
    async function (
      int: IntegrationInput,
      options: Pick<ConnectContextInput, 'institutionId' | 'connectionId'>,
    ) {
      const ctx: ConnectContextInput = {...options, envName, ledgerId}

      try {
        console.log(`[useLedgerSync] ${int.id} Will connect`)
        const preConnRes = await queryClient.fetchQuery(preConnOpts([int, ctx]))
        console.log(`[useLedgerSync] ${int.id} preConnnectRes`, preConnRes)

        const provider = extractId(int.id)[1]
        const res = await hooks[provider]?.(preConnRes, ctx)
        console.log(`[useLedgerSync] ${int.id} innerConnectRes`, res)

        const postConRes = await client.mutation('postConnect', [res, int, ctx])
        console.log(`[useLedgerSync] ${int.id} postConnectRes`, postConRes)

        void queryClient.invalidateQueries(['listConnections'])

        console.log(`[useLedgerSync] ${int.id} Did connect`)
      } catch (err) {
        if (err === CANCELLATION_TOKEN) {
          console.log(`[useLedgerSync] ${int.id} Cancelled`)
        } else {
          console.error(`[useLedgerSync] ${int.id} Connection failed`, err)
        }
      }
    },
    [envName, ledgerId, queryClient, preConnOpts, hooks, client],
  )
  return connect
}
