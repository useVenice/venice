import React from 'react'

import type {
  ConnectContextInput,
  UseLedgerSyncOptions,
} from '@ledger-sync/cdk-core'
import {extractId} from '@ledger-sync/cdk-core'
import {CANCELLATION_TOKEN} from '@ledger-sync/cdk-core'
import type {IntegrationInput} from '@ledger-sync/engine-backend'

import {LSProvider} from './LSProvider'

/** Non ledger-specific */
export function useLedgerSyncDevInfo({
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

  return {integrationsRes, ledgerIdsRes}
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

  const {hooks, client, trpc} = LSProvider.useContext()
  const integrationsRes = trpc.useQuery(['listIntegrations', [{}]])
  const connectionsRes = trpc.useQuery(['listConnections', [{ledgerId}]], {
    enabled: !!ledgerId,
    refetchInterval: 1 * 1000, // So we can refresh the syncInProgress indicator
  })

  const insRes = trpc.useQuery(['searchInstitutions', [{keywords}]])

  const adminSyncMeta = trpc.useMutation('adminSyncMetadata')
  const syncConnection = trpc.useMutation('syncConnection')
  const deleteConnection = trpc.useMutation('deleteConnection')

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

        const preConnRes = await client.mutation('preConnect', [int, ctx])
        console.log(`[useLedgerSync] ${int.id} preConnnectRes`, preConnRes)

        const provider = extractId(int.id)[1]
        const res = await hooks[provider]?.(preConnRes, ctx)
        console.log(`[useLedgerSync] ${int.id} innerConnectRes`, res)

        const postConRes = await client.mutation('postConnect', [res, int, ctx])
        console.log(`[useLedgerSync] ${int.id} postConnectRes`, postConRes)

        await connectionsRes.refetch() // Should we invalidate instead of trigger explicit refetch?

        console.log(`[useLedgerSync] ${int.id} Did connect`)
      } catch (err) {
        if (err === CANCELLATION_TOKEN) {
          console.log(`[useLedgerSync] ${int.id} Cancelled`)
        } else {
          console.error(`[useLedgerSync] ${int.id} Connection failed`, err)
        }
      }
    },
    [envName, ledgerId, client, hooks, connectionsRes],
  )
  return {
    connect,
    integrationsRes,
    connectionsRes,
    insRes,
    adminSyncMeta,
    syncConnection,
    deleteConnection,
  }
}
