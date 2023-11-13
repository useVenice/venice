import type {IntegrationDef, IntegrationSchemas} from '@usevenice/cdk'
import {intHelpers} from '@usevenice/cdk'
import type {Pta} from '@usevenice/cdk'
import {makePostingsMap} from '@usevenice/cdk'
import type {Brand} from '@usevenice/util'
import {A, startCase, z, zCast} from '@usevenice/util'

import {CACHED_CATEGORIES_MAP, zConfig} from './saltedgeClient'

export const saltedgeSchemas = {
  name: z.literal('saltedge'),
  integrationConfig: zConfig,
  resourceSettings: zCast<SaltEdge.Connection & {_id: ExternalId}>(),
  sourceOutputEntity: z.discriminatedUnion('entityName', [
    z.object({
      id: z.string(),
      entityName: z.literal('account'),
      entity: zCast<SaltEdge.Account>(),
    }),
    z.object({
      id: z.string(),
      entityName: z.literal('transaction'),
      entity: zCast<SaltEdge.Transaction>(),
    }),
  ]),
} satisfies IntegrationSchemas

export const saltedgeHelpers = intHelpers(saltedgeSchemas)

export const saltedgeDef = {
  name: 'saltedge',
  schemas: saltedgeSchemas,
  metadata: {categories: ['banking'], logoUrl: '/_assets/logo-saltedge.png'},
  standardMappers: {
    entity: {
      account: ({entity: a}, c) => ({
        id: a.id,
        entityName: 'account',
        entity: {
          // This works well for TransferWise (Personal access token)
          // (It names accounts as something like 123457678 MXN, not helpful)
          // which is the main institution we want
          // SaltEdge for. Let's revisit if this causes issue for anyone else.
          name: `${c.provider_name} - ${a.name}`,
          informationalBalances: {
            current: A(a.balance, a.currency_code),
          },
          defaultUnit: a.currency_code as Unit,
          type: ((): Pta.AccountType => {
            switch (a.nature) {
              case 'account':
                return 'asset'
              case 'savings':
              case 'card':
              case 'checking':
              case 'debit_card':
                return 'asset/bank'
              case 'ewallet':
                return 'asset/digital_wallet'
              case 'bonus':
                return 'asset/rewards'
              case 'insurance':
                return 'asset/brokerage'
              case 'investment':
                return 'asset/brokerage'
              case 'mortgage':
                return 'liability/mortgage'
              case 'credit':
                return 'liability'
              case 'credit_card':
                return 'liability/credit_card'
              case 'loan':
                return 'liability/personal_loan'
              default:
                return 'asset'
            }
          })(),
        },
      }),
      transaction: ({entity: t}) => ({
        id: t.id,
        entityName: 'transaction',
        entity: {
          date: t.made_on,
          payee: t.extra.payee,
          description: t.description,
          externalCategory:
            CACHED_CATEGORIES_MAP.personal[t.category] ?? startCase(t.category),
          postingsMap: makePostingsMap({
            main: {
              accountExternalId: t.account_id as ExternalId,
              amount: A(t.amount, t.currency_code),
            },
          }),
          externalStatus: t.status as Brand<string, 'externalStatus'>,
          custom: {possible_duplicate: true},
        },
      }),
    },
  },
} satisfies IntegrationDef<typeof saltedgeSchemas>

export default saltedgeDef
