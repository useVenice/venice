/** Used for the side effect of window.MergeLink */
import type {} from '@mergeapi/react-merge-link'

import {
  defHelpers,
  IntegrationDef,
  IntegrationImpl,
  useScript,
  CANCELLATION_TOKEN,
} from '@usevenice/cdk-core'

import {Rx, rxjs, z} from '@usevenice/util'
import {makeMergeClient, zCategory} from './MergeClient'

// TODO: Split into 3 files... Def aka common / Client / Server

export const mergeDef = {
  name: z.literal('merge'),
  integrationConfig: z.object({
    apiKey: z.string(),
  }),
  resourceSettings: z.object({
    accountToken: z.string(),
  }),
  preConnectInput: z.object({
    categories: z.array(zCategory).nullish(),
  }),
  connectInput: z.object({
    link_token: z.string(),
  }),
  connectOutput: z.object({
    publicToken: z.string(),
  }),
  sourceOutputEntity: z.discriminatedUnion('entityName', [
    z.object({
      id: z.string(),
      entityName: z.literal('account'),
      entity: z.object({}),
    }),
    z.object({
      id: z.string(),
      entityName: z.literal('transaction'),
      entity: z.object({}),
    }),
  ]),
} satisfies IntegrationDef

const helpers = defHelpers(mergeDef)

export const mergeImpl = {
  def: mergeDef,
  name: 'merge',

  preConnect: async (config, context, input) => {
    const client = makeMergeClient({apiKey: config.apiKey})
    const res = await client.integrations.post('/create-link-token', {
      body: {
        end_user_origin_id: context.userId,
        end_user_email_address: 'test@example.com',
        end_user_organization_name: 'Test Org',
        categories: input.categories ?? ['accounting'],
      },
    })
    return res
  },

  useConnectHook: () => {
    const loaded = useScript('https://cdn.merge.dev/initialize.js')
    return async ({link_token}) => {
      await loaded
      // TODO: Improve the useConnectHook api with a separate "prefetch" vs "open" fn
      await new Promise<void>((resolve) => {
        window.MergeLink.initialize({
          linkToken: link_token,
          onSuccess(publicToken, additionalInfo) {
            console.log('MergeLink onSuccess', publicToken, additionalInfo)
          },
          onValidationError: (error) => {
            console.log('MergeLink onValidationError', error)
          },
          onExit() {
            console.log('MergeLink onExit')
          },
          onReady: () => {
            console.log('onReady')
            resolve()
          },
        })
      })
      return new Promise((resolve, reject) => {
        window.MergeLink.openLink({
          onSuccess(publicToken, additionalInfo) {
            resolve({publicToken})
            console.log('MergeLink onSuccess2', publicToken, additionalInfo)
          },
          onValidationError: (error) => {
            console.log('MergeLink onValidationError', error)
            reject(error)
          },
          onExit() {
            console.log('MergeLink onExit')
            reject(CANCELLATION_TOKEN)
          },
        })
      })
    }
  },

  postConnect: async (connectOutput, config) => {
    const client = makeMergeClient({apiKey: config.apiKey})
    const res = await client.integrations.post(
      '/account-token/{public_token}',
      {path: {public_token: connectOutput.publicToken}},
    )
    return {
      resourceExternalId: res.account_token,
    }
  },

  sourceSync: ({config, settings}) => {
    const client = makeMergeClient({
      apiKey: config.apiKey,
      accountToken: settings.accountToken,
    })

    return rxjs
      .from(
        client.accounting
          .get('/accounts', {})
          .then((res) =>
            (res.results ?? [])?.map((acct) =>
              helpers._opData('account', acct.id ?? '', acct),
            ),
          ),
      )
      .pipe(Rx.mergeMap((ops) => rxjs.from(ops)))
  },
} satisfies IntegrationImpl<typeof mergeDef>
