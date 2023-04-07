/** Used for the side effect of window.MergeLink */
import type {UseMergeLinkProps} from '@mergeapi/react-merge-link/dist/types'
import type {IntegrationDef, IntegrationImpl} from '@usevenice/cdk-core'

import {CANCELLATION_TOKEN, defHelpers, useScript} from '@usevenice/cdk-core'
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
    categories: z.array(zCategory),
    end_user_email_address: z.string().optional(),
    end_user_organization_name: z.string().optional(),
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
      entity: zCast<components['schemas']['Account']>(),
    }),
    z.object({
      id: z.string(),
      entityName: z.literal('transaction'),
      entity: zCast<components['schemas']['Transaction']>(),
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
      categories: ins.categories.filter(
        (c): c is 'accounting' | 'hris' => c === 'accounting' || c === 'hris',
      ),
    }),
    resource() {
      return {
        displayName: '',
        // status: healthy vs. disconnected...
        // labels: test vs. production
      }
    },
  },
  extension: {
    sourceMapEntity: {
      account: (entity) => ({
        id: entity.id,
        entityName: 'account',
        entity: {name: entity.entity.name ?? ''},
      }),
      // transaction: (entity) => ({
      //   id: entity.id,
      //   entityName: 'transaction',
      //   entity: {date: entity.entity.transaction_date},
      // }),
    },
  },

  preConnect: async (config, context, input) => {
    const client = makeMergeClient({apiKey: config.apiKey})
    console.log('[Merge] preConnect', config, context, input)
    const res = await client.integrations.post('/create-link-token', {
      body: {
        end_user_origin_id: context.userId,
        end_user_email_address:
          input.end_user_email_address ?? 'test@example.com',
        end_user_organization_name:
          input.end_user_organization_name ?? 'Test Org',
        categories: input.categories ?? ['accounting'],
      },
    })
    return res
  },

  useConnectHook: () => {
    const scriptLoaded = useScript('https://cdn.merge.dev/initialize.js')

    // TODO: Improve the useConnectHook api with a separate "prefetch" vs "open" fn
    // To take into account the fact that we can initialize the link eagerly
    return ({link_token}) =>
      new Promise(async (resolve, reject) => {
        await scriptLoaded

        const options = {
          shouldSendTokenOnSuccessfulLink: true,
          // Will need to be passed into both initialize and openLink
          // otherwise will not open the oauth dialog
          linkToken: link_token,
          onSuccess(publicToken, additionalInfo) {
            console.log('[MergeLink] onSuccess', publicToken, additionalInfo)
            resolve({publicToken})
          },
          onValidationError: (error) => {
            console.log('[MergeLink] onValidationError', error)
            reject(error)
          },
          onExit() {
            console.log('[MergeLink] onExit')
            reject(CANCELLATION_TOKEN)
          },
        } satisfies UseMergeLinkProps
        await new Promise<void>((_resolve) => {
          window.MergeLink.initialize({
            ...options,
            onReady: () => {
              console.log('[MergeLink] onReady')
              _resolve()
            },
          })
        })
        window.MergeLink.openLink(options)
      })
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
        triggerDefaultSync: true,
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
      triggerDefaultSync: true,
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
