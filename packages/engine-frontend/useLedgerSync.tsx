import {LSProvider} from './LSProvider'
import type {ConnectContext, PreConnOptions} from '@ledger-sync/cdk-core'
import {CANCELLATION_TOKEN} from '@ledger-sync/cdk-core'
import type {IntegrationInput} from '@ledger-sync/engine'
import type {NonNullableOnly} from '@ledger-sync/util'
import React from 'react'

export function useLedgerSync({ledgerId, envName}: ConnectContext) {
  console.log('[useLedgerSync]', {ledgerId, envName})
  // There has to be a shorthand for this...
  const ctx = React.useMemo<ConnectContext>(
    () => ({ledgerId, envName}),
    [ledgerId, envName],
  )

  const {hooks, client, trpc} = LSProvider.useContext()
  const preConnectOptionsRes = trpc.useQuery(['listPreConnectOptions', [ctx]], {
    enabled: !!ledgerId,
  })
  const connectionsRes = trpc.useQuery(
    ['listConnections', [{ledgerId: ctx.ledgerId}]],
    {enabled: !!ledgerId},
  )

  const insRes = trpc.useQuery(['listInstitutions', []])

  const connect = React.useCallback(
    async function (
      int: NonNullableOnly<IntegrationInput, 'provider'>,
      {key, options}: PreConnOptions,
    ) {
      try {
        const preConnRes = await client.mutation('preConnect', [int, options])
        console.log(`${key} preConnnectRes`, preConnRes)

        const res = await hooks[int.provider]?.(preConnRes)
        console.log(`${key} innerConnectRes`, res)

        const postConRes = await client.mutation('postConnect', [int, res, ctx])
        console.log(`${key} postConnectRes`, postConRes)
        // TODO: We should get the client and invalidate instead
        await connectionsRes.refetch()
      } catch (err) {
        if (err === CANCELLATION_TOKEN) {
          console.log(`${key} Cancelled`)
        } else {
          console.error(`${key} Connection failed`, err)
        }
      }
    },
    [client, hooks, ctx, connectionsRes],
  )
  return {connect, preConnectOptionsRes, connectionsRes, insRes}
}
