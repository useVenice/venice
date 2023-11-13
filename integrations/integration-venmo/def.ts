import type {IntegrationDef, IntegrationSchemas} from '@usevenice/cdk-core'
import {intHelpers} from '@usevenice/cdk-core'
import {zEntityPayload} from '@usevenice/cdk-core'
import type {Brand} from '@usevenice/util'
import {A, DateTime, z, zCast} from '@usevenice/util'

import {
  descriptionFromTransaction,
  payeeFromTransaction,
  postingsFromTransaction,
} from './venmo-helpers'
import {zConfig} from './VenmoClient'

// Venmo appears to only support USD for now
const VENMO_CURR = 'USD' as Unit

const zSettings = z.object({
  me: zCast<Venmo.GetCurrentUserData>(),
  // TODO: Store venmo credentials inside VGS rather than own db
  credentials: zCast<Venmo.Credentials>(),
})

export const venmoSchemas = {
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
  destinationInputEntity: zEntityPayload,
} satisfies IntegrationSchemas

export const helpers = intHelpers(venmoSchemas)

export const venmoDef = {
  name: 'venmo',
  schemas: venmoSchemas,
  metadata: {categories: ['banking'], logoUrl: '/_assets/logo-venmo.png'},
  extension: {
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
  },
} satisfies IntegrationDef<typeof venmoSchemas>

export default venmoDef
