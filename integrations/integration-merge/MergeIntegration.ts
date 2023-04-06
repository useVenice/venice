/** Used for the side effect of window.MergeLink */
import type {} from '@mergeapi/react-merge-link'

import {
  CANCELLATION_TOKEN,
  defHelpers,
  IntegrationDef,
  IntegrationImpl,
  useScript,
} from '@usevenice/cdk-core'

import {Rx, rxjs, z, zCast} from '@usevenice/util'
import type {components} from './merge.accounting.gen'
import {makeMergeClient, zCategory, zIntegration} from './MergeClient'

// TODO: Split into 3 files... Def aka common / Client / Server

export const mergeDef = {
  name: z.literal('merge'),
  integrationConfig: z.object({
    apiKey: z.string(),
  }),
  institutionData: zIntegration,
  resourceSettings: z.object({
    accountToken: z.string(),
    accountDetails: zCast<components['schemas']['AccountDetails']>().optional(),
  }),
  preConnectInput: z.object({
    categories: z.array(zCategory).default(['accounting']),
  }),
  connectInput: z.object({
    link_token: z.string(),
  }),
  connectOutput: z.union([
    z.object({publicToken: z.string()}),
    // Perfect example why this should be called postConnectInput
    // Can only be provided via CLI...
    // could this possibly eliminate the need for checkResource?
    z.object({accountToken: z.string()}),
  ]),
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

  standardMappers: {
    institution: (ins) => ({
      name: ins.name,
      logoUrl: ins.square_image,
      envName: undefined,
    }),
    resource() {
      return {
        displayName: '',
        // status: healthy vs. disconnected...
        // labels: test vs. production
      }
    },
  },

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
    if ('publicToken' in connectOutput) {
      const client = makeMergeClient({apiKey: config.apiKey})
      const res = await client.integrations.get(
        '/account-token/{public_token}',
        {path: {public_token: connectOutput.publicToken}},
      )

      // TODO: Add support for HRIS integrations and better understand the behavior across them

      const details = await client.accounting.get('/account-details', {
        header: {'X-Account-Token': res.account_token},
      })

      return {
        // There does not appear to be a unique id in addition to the access token...
        resourceExternalId: details.id ?? '',
        settings: {
          accountToken: res.account_token,
          accountDetails: details,
        },
        institution: {
          externalId: res.integration.slug,
          data: res.integration,
        },
      }
    }
    const client = makeMergeClient({
      apiKey: config.apiKey,
      accountToken: connectOutput.accountToken,
    })
    const details = await client.accounting.get('/account-details', {})
    const integrations = await client.integrations.get('/', {})
    const integration = integrations.find(
      (i) => i.slug === details.integration_slug,
    )

    return {
      // There does not appear to be a unique id in addition to the access token...
      resourceExternalId: details.id ?? '',
      settings: {
        accountToken: connectOutput.accountToken,
        accountDetails: details,
      },
      institution: integration
        ? {externalId: integration.slug, data: integration}
        : undefined,
    }
  },

  revokeResource: async (settings, config) => {
    const client = makeMergeClient({
      apiKey: config.apiKey,
      accountToken: settings.accountToken,
    })
    await client.accounting.post('/delete-account', {})
  },

  // MARK: -

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
