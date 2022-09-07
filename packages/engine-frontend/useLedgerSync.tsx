import React from 'react'

import type {
  ConnectContextInput,
  UseLedgerSyncOptions,
} from '@ledger-sync/cdk-core'
import {CANCELLATION_TOKEN} from '@ledger-sync/cdk-core'
import type {IntegrationInput} from '@ledger-sync/engine'
import type {NonNullableOnly} from '@ledger-sync/util'

import {LSProvider} from './LSProvider'

/**
 * Client side of makeSyncEngine
 */
export function useLedgerSync({ledgerId, envName}: UseLedgerSyncOptions) {
  console.log('[useLedgerSync]', {ledgerId, envName})
  // There has to be a shorthand for this...

  const {hooks, client, trpc} = LSProvider.useContext()
  const preConnectOptionsRes = trpc.useQuery(
    ['listPreConnectOptions', [{envName, ledgerId}]],
    {enabled: !!ledgerId},
  )
  const connectionsRes = trpc.useQuery(['listConnections', [{ledgerId}]], {
    enabled: !!ledgerId,
  })

  const insRes = trpc.useQuery(['listInstitutions', []])

  const connect = React.useCallback(
    async function (
      int: NonNullableOnly<IntegrationInput, 'provider'>,
      options: Pick<ConnectContextInput, 'institutionId' | 'connectionId'>,
    ) {
      const ctx: ConnectContextInput = {...options, envName, ledgerId}

      try {
        const preConnRes = await client.mutation('preConnect', [int, ctx])
        console.log(`${int.provider} preConnnectRes`, preConnRes)

        const res = await hooks[int.provider]?.(preConnRes, ctx)
        console.log(`${int.provider} innerConnectRes`, res)

        const postConRes = await client.mutation('postConnect', [int, ctx, res])
        console.log(`${int.provider} postConnectRes`, postConRes)
        // TODO: We should get the client and invalidate instead
        await connectionsRes.refetch()
      } catch (err) {
        if (err === CANCELLATION_TOKEN) {
          console.log(`${int.provider} Cancelled`)
        } else {
          console.error(`${int.provider} Connection failed`, err)
        }
      }
    },
    [envName, ledgerId, client, hooks, connectionsRes],
  )
  return {connect, preConnectOptionsRes, connectionsRes, insRes}
}
