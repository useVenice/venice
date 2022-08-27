import {ConnectContext, PreConnOptions} from '@ledger-sync/cdk-core'
import {IntegrationInput} from '@ledger-sync/engine'
import {NonNullableOnly} from '@ledger-sync/util'
import React from 'react'
import {LSProvider} from './LSProvider'

export function useLedgerSync(ctx: ConnectContext) {
  const {hooks, client, trpc} = LSProvider.useContext()
  const res = trpc.useQuery(['listPreConnectOptions', [ctx]])

  const connect = React.useCallback(
    async function (
      int: NonNullableOnly<IntegrationInput, 'provider'>,
      {key, options}: PreConnOptions,
    ) {
      const res1 = await client.mutation('preConnect', [int, options])
      console.log(`${key} res1`, res1)

      const res2 = await hooks[int.provider]?.(res1)
      console.log(`${key} res2`, res2)

      const res3 = await client.mutation('postConnect', [int, res2])
      console.log(`${key} res3`, res3)
    },
    [hooks, client],
  )
  return {connect, preConnectOptionsRes: res}
}
