import {makeSyncProvider, zIntAuth} from '@usevenice/cdk-core'
import {
  makePostingsMap,
  makeStandardId,
  veniceProviderBase,
} from '@usevenice/cdk-ledger'
import {A, md5Hash, R, Rx, rxjs, z} from '@usevenice/util'

import {
  businessResponseSchema,
  makeRampClient,
  transactionResponseItemSchema,
} from './RampClient'

const kRamp = 'ramp' as const
type RampEntity = z.infer<(typeof def)['sourceOutputEntity']>
type RampSrcSyncOptions = z.infer<(typeof def)['sourceState']>
type RampSyncOperation = (typeof def)['_opType']

const def = makeSyncProvider.def({
  ...veniceProviderBase.def,
  name: z.literal('ramp'),
  integrationConfig: zIntAuth.oauth,
  resourceSettings: z.object({
    accessToken: z.string().nullish(),
    startAfterTransactionId: z.string().nullish(),
  }),
  connectInput: z.object({
    accessToken: z.string().nullish(),
  }),
  connectOutput: z.object({
    accessToken: z.string().nullish(),
    clientId: z.string().nullish(),
    clientSecret: z.string().nullish(),
  }),
  sourceOutputEntity: z.discriminatedUnion('entityName', [
    z.object({
      id: z.string(),
      entityName: z.literal('account'),
      entity: businessResponseSchema,
    }),
    z.object({
      id: z.string(),
      entityName: z.literal('transaction'),
      entity: transactionResponseItemSchema,
    }),
  ]),
  sourceState: z.object({
    startAfterTransactionId: z.string().nullish(),
    accessToken: z.string().nullish(),
    clientId: z.string().nullish(),
    clientSecret: z.string().nullish(),
  }),
})

export const rampProvider = makeSyncProvider({
  metadata: {
    categories: ['banking', 'expense-management'],
    logoUrl: '/_assets/logo-ramp.png',
    stage: 'beta',
  },
  ...veniceProviderBase(def, {
    sourceMapEntity: {
      account: ({entity: a}) => ({
        id: a.id,
        entityName: 'account',
        entity: {
          name: `${a.business_name_on_card}`,
          type: 'asset/bank',
          institutionName: a.business_name_legal,
        },
      }),
      transaction: ({entity: t}) => ({
        id: t.id,
        entityName: 'transaction',
        entity: {
          date: t.user_transaction_time,
          description: t.merchant_descriptor ?? '',
          payee: t.merchant_name,
          externalCategory: t.sk_category_name ?? '',
          postingsMap: makePostingsMap({
            main: {
              amount: A(-1 * t.amount, 'USD' as Unit),
              memo:
                t.memo ??
                R.compact([
                  `${t.card_holder.first_name} ${t.card_holder.last_name}`,
                  t.merchant_category_code,
                ]).join('/'),
              subAccountKey: t.state.toLowerCase() ?? undefined,
            },
          }),
          custom: {
            user: `${t.card_holder.first_name} ${t.card_holder.last_name}`,
          },
        },
      }),
    },
  }),

  postConnect: (input) => ({
    resourceExternalId: input.clientId ?? '',
    settings: input,
    triggerDefaultSync: true,
  }),

  // Disable it for now until it's ready
  // handleWebhook: (input) => {
  //   const conn = identity<z.infer<typeof base['resourceSchema']>>({
  //     clientId: '',
  //     clientSecret: '',
  //     authorizationCode: input.query['code'] as string,
  //   })
  //   const sync$: rxjs.Observable<RampSyncOperation> =
  //     rampProvider.sourceSync(conn)
  //   return rxjs.concat(sync$)
  // },
  sourceSync: ({settings, config}) => {
    const client = makeRampClient(config.oauth)
    async function* iterateEntities() {
      const accessToken = await client.getAccessToken()
      // const accessToken = await client.getToken({
      //   code: input.authorizationCode ?? '',
      //   redirectUri: `${redirectUri}/api/webhook/ramp`,
      // })
      // TODO: Need to do pagination for account if it necessary
      const res = [await client.getBusiness(accessToken)]
      yield res.map((a) =>
        _op({
          type: 'data',
          data: {id: a.id, entity: a, entityName: 'account'},
        }),
      )

      let starting_after = settings.startAfterTransactionId ?? undefined
      while (true) {
        const res2 = await client.getTransactions({
          accessToken,
          start:
            starting_after && starting_after.length > 0
              ? starting_after
              : undefined,
        })
        starting_after = res2.data[res2.data.length - 1]?.id ?? ''
        yield [
          ...res2.data.map((t) => opData('transaction', t.id, t)),
          // Use the hashed accessToken for now until we now what the id that can we use for meta data
          opMeta(md5Hash(settings.accessToken ?? ''), {
            startAfterTransactionId: starting_after,
          }),
        ]
        if (!res2.page.next) {
          break
        }
      }
    }

    return rxjs
      .from(iterateEntities())
      .pipe(Rx.mergeMap((ops) => rxjs.from([...ops, _op({type: 'commit'})])))
  },
})

const _op: typeof R.identity<RampSyncOperation> = R.identity

const opData = <K extends RampEntity['entityName']>(
  entityName: K,
  id: string,
  entity: Extract<RampEntity, {entityName: K}>['entity'] | null,
) => ({type: 'data', data: {entity, entityName, id}} as RampSyncOperation)

const opMeta = (id: string, sourceState: Partial<RampSrcSyncOptions>) =>
  ({
    type: 'resoUpdate',
    id: makeStandardId('reso', kRamp, id),
    sourceState,
  } as RampSyncOperation)
