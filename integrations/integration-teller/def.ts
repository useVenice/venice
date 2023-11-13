import type {IntegrationDef, IntegrationSchemas} from '@usevenice/cdk'
import {intHelpers} from '@usevenice/cdk'
import {makePostingsMap} from '@usevenice/cdk'
import {A, parseMoney, z} from '@usevenice/util'

import {
  accountTellerSchema,
  transactionItemSchema,
  zInstitution,
  zTellerConfig,
} from './TellerClient'

export const tellerSchemas = {
  name: z.literal('teller'),
  integrationConfig: zTellerConfig,
  resourceSettings: z.object({
    token: z.string(),
  }),
  institutionData: zInstitution,
  connectInput: z.object({
    applicationId: z.string(),
    userToken: z.string().nullish(),
  }),
  connectOutput: z.object({
    token: z.string(),
  }),
  sourceOutputEntity: z.discriminatedUnion('entityName', [
    z.object({
      id: z.string(),
      entityName: z.literal('account'),
      entity: accountTellerSchema,
    }),
    z.object({
      id: z.string(),
      entityName: z.literal('transaction'),
      entity: transactionItemSchema,
    }),
    z.object({
      id: z.string(),
      entityName: z.literal('institution'),
      entity: zInstitution,
    }),
  ]),
} satisfies IntegrationSchemas

export const helpers = intHelpers(tellerSchemas)

export const tellerDef = {
  name: 'teller',
  schemas: tellerSchemas,
  metadata: {categories: ['banking'], logoUrl: '/_assets/logo-teller.svg'},

  standardMappers: {
    resource: (settings) => ({
      displayName: 'TODO' + settings.token,
      institutionId: 'ins_teller_TODO',
    }),
    institution: (data) => ({
      name: data.name,
      logoUrl: data.logoUrl,
      envName: undefined,
      loginUrl: undefined,
    }),
  },
  extension: {
    sourceMapEntity: (data) => {
      if (data.entityName === 'account') {
        const a = data.entity
        return {
          id: a.id,
          entityName: 'account',
          entity: {
            name: a.name,
            lastFour: a.last_four,
            type: 'asset/bank',
            institutionName: a.institution.name,
            informationalBalances: {
              current: null,
              available: A(
                parseMoney(data.entity.balance?.available ?? ''),
                data.entity.currency as Unit,
              ),
              limit: null,
            },
            defaultUnit: a.currency as Unit,
          },
        }
      }
      if (data.entityName === 'transaction') {
        const t = data.entity
        return {
          id: t.id,
          entityName: 'transaction',
          entity: {
            date: t.date,
            description: data.entity.description,
            externalCategory: data.entity.details.category,
            payee: data.entity.details.counterparty.name,
            postingsMap: makePostingsMap({
              main: {
                accountExternalId: data.entity.account_id as ExternalId,
                // TODO: Need to store `accounts` within `connection` so that
                // we can look up the proper currency as transactions themselves
                // do not contain currency.

                // TODO: Need to better understand the rules around how teller signs amounts
                // For credit cards, it appears to use positive to indicate expense https://share.cleanshot.com/TsfvXL
                // but what about for bank accounts and others?
                amount: A(-1 * parseMoney(data.entity.amount), 'USD' as Unit),
              },
            }),
          },
        }
      }
      // TODO: Map transactions
      return null
    },
  },
} satisfies IntegrationDef<typeof tellerSchemas>

export default tellerDef
