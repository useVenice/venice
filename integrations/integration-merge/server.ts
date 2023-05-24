/** Used for the side effect of window.MergeLink */

import type {IntegrationServer} from '@usevenice/cdk-core'
import {Rx, rxjs} from '@usevenice/util'

import type {mergeSchemas} from './def'
import {helpers} from './def'
import {makeMergeClient} from './MergeClient'

export const mergeServer = {
  preConnect: async (config, context, input) => {
    const client = makeMergeClient({apiKey: config.apiKey})
    const res = await client.integrations.post('/create-link-token', {
      bodyJson: {
        end_user_origin_id: context.extEndUserId,
        end_user_email_address:
          input.end_user_email_address ?? 'test@example.com',
        end_user_organization_name:
          input.end_user_organization_name ?? 'Test Org',
        categories: input.categories ?? ['accounting'],
      },
    })
    return res
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
} satisfies IntegrationServer<typeof mergeSchemas>

export default mergeServer
