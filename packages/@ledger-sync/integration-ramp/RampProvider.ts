import {A, compact, Deferred, identity, md5Hash, Rx, rxjs, z} from '@ledger-sync/util'
import {makeSyncProvider} from '@ledger-sync/core-sync'
import {
  ledgerSyncProviderBase,
  makePostingsMap,
  makeStandardId,
} from '@ledger-sync/ledger-sync'
import React from 'react'
import {
  businessResponseSchema,
  makeRampClient,
  transactionResponseItemSchema,
} from './RampClient'

const kRamp = 'ramp' as const
type RampEntity = z.infer<typeof def['sourceOutputEntity']>
type RampSrcSyncOptions = z.infer<typeof def['sourceSyncOptions']>
type RampSyncOperation = typeof def['_opType']

const def = makeSyncProvider.def({
  ...ledgerSyncProviderBase.def,
  name: z.literal('ramp'),
  connectionSettings: z.object({accessToken: z.string().nullish()}),
  preConnectInput: z.object({
    clientId: z.string(),
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
  sourceSyncOptions: z.object({
    startAfterTransactionId: z.string().nullish(),
    accessToken: z.string().nullish(),
    clientId: z.string().nullish(),
    clientSecret: z.string().nullish(),
  }),
})

export const rampProvider = makeSyncProvider({
  ...ledgerSyncProviderBase(def, {
    sourceMapEntity: (data) => {
      if (data.entityName === 'account') {
        const a = data.entity
        return {
          id: a.id,
          entityName: 'account',
          entity: {
            name: `${a.business_name_on_card}`,
            type: 'asset/bank',
            institutionName: a.business_name_legal,
          },
        }
      } else if (data.entityName === 'transaction') {
        const t = data.entity

        return {
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
                  compact([
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
        }
      }
      return null
    },
  }),
  preConnect: (_input, config) =>
    makeRampClient(config)
      .getAccessToken()
      .then((token) => ({accessToken: token})),

  // TODO: Need to find a way to skip unnecessary pipe/connection
  useConnectHook: (_type) => {
    // const [options, setOptions] = React.useState<z.infer<
    //   typeof def['connectInput']
    // > | null>(null)

    const [isShowPromt, setIsShowPromt] = React.useState(false)
    const [deferred] = React.useState(
      new Deferred<typeof def['_types']['connectOutput']>(),
    )

    React.useEffect(() => {
      if (isShowPromt) {
        const clientId = window.prompt('Input Ramp Client ID')
        const clientSecret = window.prompt('Input Ramp Client Secret')

        // Pass the clientId and clientSecret for now because of the CORS issue when run the oauth
        deferred.resolve({
          clientId: clientId ?? '',
          clientSecret: clientSecret ?? '',
        })
        // makeRampClient(zRampConfig.parse({clientId: '5gyTltFyF9yzcDidg9IcavfG0UsYg5crY5GpmK4kE4HOAN6k', clientSecret: 'pWrVEjy0TtZ1DZHaiZ6srwrJcCWnrKJoF3irwq5mdbIbUDL0'}))
        //   .getAccessToken()
        //   .then((res) => deferred.resolve({ clientId: clientId ?? '', clientSecret: clientSecret ?? ''}))
        //   .catch(console.log)

        // TODO: Use it when we use authorization code
        // const clientId = window.prompt('Input Ramp Client ID', '5gyTltFyF9yzcDidg9IcavfG0UsYg5crY5GpmK4kE4HOAN6k')
        // const clientSecret = window.prompt('Input Ramp Client Secret', 'pWrVEjy0TtZ1DZHaiZ6srwrJcCWnrKJoF3irwq5mdbIbUDL0')
        // if(clientId && clientSecret) {
        //   window.open(
        //     makeRampClient({clientId, clientSecret}).getAuthorizeUrl(`${redirectUri}/api/webhook/ramp`),
        //     'popup',
        //   )
        // }
      }
    }, [isShowPromt, deferred])

    return (_opts) => {
      setIsShowPromt(true)
      return deferred.promise
    }
  },

  postConnect: async (input) => {
    const settings = identity<z.infer<typeof def['connectionSettings']>>({
      ...input,
    })
    const source$: rxjs.Observable<RampSyncOperation> = rampProvider.sourceSync({settings, options: {}})
    return {
      connectionId: `conn_ramp_${input.clientId}`,
      settings,
      source$,
    }
  },

  // Disable it for now until it's ready
  // handleWebhook: (input) => {
  //   const conn = identity<z.infer<typeof base['connectionSchema']>>({
  //     clientId: '',
  //     clientSecret: '',
  //     authorizationCode: input.query['code'] as string,
  //   })
  //   const sync$: rxjs.Observable<RampSyncOperation> =
  //     rampProvider.sourceSync(conn)
  //   return rxjs.concat(sync$)
  // },
  sourceSync: ({options}) => {
    const client = makeRampClient({
      clientId: options.clientId ?? '',
      clientSecret: options.clientSecret ?? '',
    })
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

      let starting_after = options.startAfterTransactionId ?? undefined
      while (true) {
        const res2 = await client.getTransactions({
          accessToken,
          start:
            starting_after && starting_after.length
              ? starting_after
              : undefined,
        })
        starting_after = res2.data?.[res2.data.length - 1]?.id ?? ''
        yield [
          ...res2.data.map((t) => opData('transaction', t.id, t)),
          // Use the hashed accessToken for now until we now what the id that can we use for meta data
          opMeta(md5Hash(options.accessToken ?? ''), {
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

const _op: typeof identity<RampSyncOperation> = identity

const opData = <K extends RampEntity['entityName']>(
  entityName: K,
  id: string,
  entity: Extract<RampEntity, {entityName: K}>['entity'] | null,
) => ({type: 'data', data: {entity, entityName, id}} as RampSyncOperation)

const opMeta = (id: string, sourceSyncOptions: Partial<RampSrcSyncOptions>) =>
  ({
    type: 'metaUpdate',
    id: makeStandardId('conn', kRamp, id),
    sourceSyncOptions,
  } as RampSyncOperation)
