import {ConnectContext, PreConnOptions} from '@ledger-sync/cdk-core'
import {IntegrationInput} from '@ledger-sync/engine'
import {NonNullableOnly} from '@ledger-sync/util'
import React from 'react'
import {LSProvider} from './LSProvider'

export function useLedgerSync({ledgerId, envName}: ConnectContext) {
  console.log(`[useLedgerSync]`, {ledgerId, envName})
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
      const res1 = await client.mutation('preConnect', [int, options])
      console.log(`${key} res1`, res1)

      const res2 = await hooks[int.provider]?.(res1)
      console.log(`${key} res2`, res2)

      const res3 = await client.mutation('postConnect', [int, res2, ctx])
      console.log(`${key} res3`, res3)
      // TODO: We should get the client and invalidate instead
      await connectionsRes.refetch()
    },
    [client, hooks, ctx, connectionsRes],
  )
  return {connect, preConnectOptionsRes, connectionsRes, insRes}
}
