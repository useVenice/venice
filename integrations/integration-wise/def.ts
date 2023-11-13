import type {IntegrationDef, IntegrationSchemas} from '@usevenice/cdk'
import {intHelpers} from '@usevenice/cdk'
import {makePostingsMap} from '@usevenice/cdk'
import {A, z} from '@usevenice/util'

import {
  profileResponseItemSchema,
  transferResponseItemSchema,
  zEnvName,
} from './WiseClient'

export const wiseSchemas = {
  name: z.literal('wise'),
  // integrationConfig: zWiseConfig,
  resourceSettings: z.object({
    envName: zEnvName,
    apiToken: z.string().nullish(),
  }),
  connectInput: z.object({
    redirectUri: z.string(),
    clientId: z.string(),
    envName: zEnvName,
  }),
  connectOutput: z.object({
    envName: zEnvName,
    apiToken: z.string().nullish(),
  }),
  sourceOutputEntity: z.discriminatedUnion('entityName', [
    z.object({
      id: z.string(),
      entityName: z.literal('account'),
      entity: profileResponseItemSchema,
    }),
    z.object({
      id: z.string(),
      entityName: z.literal('transaction'),
      entity: transferResponseItemSchema,
    }),
  ]),
} satisfies IntegrationSchemas

export const wiseHelpers = intHelpers(wiseSchemas)

export const wiseDef = {
  name: 'wise',
  schemas: wiseSchemas,
  metadata: {categories: ['banking'], logoUrl: '/_assets/logo-wise.png'},
  extension: {
    sourceMapEntity: (data) => {
      if (data.entityName === 'account') {
        const a = data.entity
        return {
          id: `${a.id}`,
          entityName: 'account',
          entity: {
            name: `${data.entity.details.firstName} ${data.entity.details.lastName}`,
            type: 'expense',
          },
        }
      } else if (data.entityName === 'transaction') {
        const t = data.entity

        return {
          id: `${t.id}`,
          entityName: 'transaction',
          entity: {
            date: t.created,
            description: t.details.reference ?? '',
            postingsMap: makePostingsMap({
              main: {
                accountExternalId: (data.entity.quoteUuid ?? '') as ExternalId,
                amount: A(
                  data.entity.sourceValue ?? 0,
                  (data.entity.sourceCurrency ?? 'USD') as Unit,
                ),
              },
            }),
          },
        }
      }
      return null
    },
  },
} satisfies IntegrationDef<typeof wiseSchemas>

export default wiseDef
