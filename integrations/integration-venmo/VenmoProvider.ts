import {makeSyncProvider} from '@usevenice/cdk-core'
import {veniceProviderBase} from '@usevenice/cdk-ledger'
import type {Brand} from '@usevenice/util'
import {A, DateTime, Rx, rxjs, z, zCast} from '@usevenice/util'

import {
  descriptionFromTransaction,
  payeeFromTransaction,
  postingsFromTransaction,
} from './venmo-helpers'
import {makeVenmoClient, zConfig} from './VenmoClient'

// Venmo appears to only support USD for now
const VENMO_CURR = 'USD' as Unit

const zSettings = z.object({
  me: zCast<Venmo.GetCurrentUserData>(),
  // TODO: Store venmo credentials inside VGS rather than own db
  credentials: zCast<Venmo.Credentials>(),
})
const _def = makeSyncProvider.def({
  ...veniceProviderBase.def,
  name: z.literal('venmo'),
  integrationConfig: zConfig,
  resourceSettings: zSettings,
  sourceOutputEntity: z.discriminatedUnion('entityName', [
    z.object({
      id: z.string(),
      entityName: z.literal('account'),
      entity: zCast<Venmo.GetCurrentUserData>(),
    }),
    z.object({
      id: z.string(),
      entityName: z.literal('transaction'),
      entity: zCast<Venmo.Transaction & {_currentUserId: string}>(),
    }),
  ]),
})

export const venmoProviderDef = makeSyncProvider.def.helpers(_def)

export const venmoProvider = makeSyncProvider({
  ...veniceProviderBase(venmoProviderDef, {
    sourceMapEntity: {
      account: ({entity: a}, _extConn) => ({
        id: a.user.id,
        entityName: 'account',
        entity: {
          name: `Venmo (${a.user.username})`,
          informationalBalances: {
            current: A(Number.parseInt(a.balance, 10), VENMO_CURR),
          },
          lastFour: a.user.username,
          type: 'asset/digital_wallet',
        },
      }),
      transaction: ({entity: t}, extConn) => ({
        id: t.id,
        entityName: 'transaction',
        entity: {
          date: DateTime.fromISO(t.datetime_created).toISODate(),
          description: descriptionFromTransaction(t),
          payee: payeeFromTransaction(
            t,
            extConn.me.user.id ?? t._currentUserId,
          ),
          postingsMap: postingsFromTransaction(
            t,
            extConn.me.user.id ?? t._currentUserId,
          ),
          externalStatus: t.transfer?.status as Brand<string, 'externalStatus'>,
        },
      }),
    },
  }),
  sourceSync: ({config, settings: {credentials}}) => {
    const venmo = makeVenmoClient(config, credentials)
    async function* iterateEntities() {
      const me = await venmo.getCurrentUser()
      yield [me].map((a) =>
        venmoProviderDef._opData('account', `${a.user.id}`, a),
      )
      const iterator = venmo.iterateAllTransactions({
        currentUser: me,
      })
      // TODO: Iterate venmo statements and sync to balance records
      for await (const transactions of iterator) {
        yield transactions.map((t) =>
          venmoProviderDef._opData('transaction', t.id, {
            ...t,
            _currentUserId: me.user.id,
          }),
        )
      }
    }
    return rxjs
      .from(iterateEntities())
      .pipe(
        Rx.mergeMap((ops) =>
          rxjs.from([...ops, venmoProviderDef._op('commit')]),
        ),
      )
  },
})
