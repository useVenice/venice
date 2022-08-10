import {castIs, memoize, z, zFunction} from '@ledger-sync/util'
import Stripe from 'stripe'
// eslint-disable-next-line import/no-cycle
import {inferStripeModeFromToken} from './stripe-utils'

export type ModeName = z.infer<typeof zModeName>

const accountParamsSchema = z.object({
  secretKey: z.string(),
  accountId: z.string(),
})

const transactionAccountSchema = z.object({
  secretKey: z.string(),
  starting_after: z.string().nullish(),
})
export const zModeName = z.enum(['test', 'live'])
export const zStripeConfig = z.object({
  accountId: z.string().nullish(),
  publishableKeys: z
    .record(z.string())
    .refine(castIs<Partial<{[K in ModeName]: string}>>())
    .nullish(),
  secretKeys: z
    .record(z.string())
    .refine(castIs<Partial<{[K in ModeName]: string}>>())
    .nullish(),
  secretKey: z.string().nullish(),
}).nullish()

export const makeStripeClient = zFunction(zStripeConfig, (cfg) => {
  const fromMode = memoize((modeName: ModeName | undefined) => {
    const secretKey =
      modeName && (cfg?.secretKeys?.[modeName] || (cfg?.secretKey ?? ''))

    if (!modeName || !secretKey) {
      throw new Error(`Unable to get client mode=${modeName}`)
    }
    const configuration: Stripe.StripeConfig = {
      apiVersion: '2020-03-02',
    }
    return new Stripe(secretKey, configuration)
  })
  function fromToken(token: string) {
    return fromMode(inferStripeModeFromToken(token))
  }

  return {
    getAccount: zFunction(accountParamsSchema, (opts) =>
      fromToken(opts.secretKey).accounts.retrieve(opts.accountId),
    ),
    getBalance: zFunction(z.string(), (secretKey) =>
      fromToken(secretKey).balance.retrieve(),
    ),
    getBalanceTransactions: zFunction(transactionAccountSchema, (opts) =>
      fromToken(opts.secretKey).balanceTransactions.list({
        limit: 100,
        starting_after: opts.starting_after ?? undefined,
      }),
    ),
  }
})
