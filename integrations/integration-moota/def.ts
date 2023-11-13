import type {IntegrationDef, IntegrationSchemas} from '@usevenice/cdk-core'
import {intHelpers} from '@usevenice/cdk-core'
import {makePostingsMap} from '@usevenice/cdk-core'
import {A, objectFromArray, z, zCast} from '@usevenice/util'

import {zConfig} from './mootaClient'

export const mootaSchemas = {
  name: z.literal('moota'),
  integrationConfig: zConfig,
  sourceOutputEntity: z.discriminatedUnion('entityName', [
    z.object({
      id: z.string(),
      entityName: z.literal('account'),
      entity: zCast<Moota.BankAccount>(),
    }),
    z.object({
      id: z.string(),
      entityName: z.literal('transaction'),
      entity: zCast<Moota.Transaction>(),
    }),
  ]),
} satisfies IntegrationSchemas

export const mootaHelpers = intHelpers(mootaSchemas)

function toISO(mootaDate: string) {
  // Local timezone
  return mootaDate.replace(' ', 'T') + '+07:00' // Always Jakarta time
}

export const mootaDef = {
  name: 'moota',
  schemas: mootaSchemas,
  metadata: {categories: ['banking'], logoUrl: '/_assets/logo-moota.png'},
  extension: {
    sourceMapEntity: {
      account: ({entity: a}) => ({
        id: a.bank_id,
        entityName: 'account',
        entity: {
          name: `${a.label} ${a.atas_nama} (${a.account_number})`,
          informationalBalances: {
            current: A(Number.parseFloat(a.balance), 'IDR'),
          },
          type: 'asset/bank',
          countryCode: 'ID',
          institutionName: a.label,
          defaultUnit: 'IDR' as Unit,
        },
      }),

      transaction: ({entity: t}) => ({
        id: t.mutation_id,
        entityName: 'transaction',
        entity: {
          date: toISO(t.created_at),
          description: t.description,
          payee: t.note, // Payee is a bit better due to the lack of separate payee field in moota
          labelsMap: objectFromArray(
            t.taggings ?? [],
            (tag) => tag.name,
            () => true,
          ),
          postingsMap: makePostingsMap({
            main: {
              accountExternalId: t.bank_id as ExternalId,
              amount:
                t.type === 'CR'
                  ? A(Number.parseFloat(t.amount), 'IDR')
                  : A(-Number.parseFloat(t.amount), 'IDR'),
            },
          }),
        },
      }),
    },
  },
} satisfies IntegrationDef<typeof mootaSchemas>

export default mootaDef
