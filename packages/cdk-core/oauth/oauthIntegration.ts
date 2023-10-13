import type NangoFrontend from '@nangohq/frontend'
import type {AuthError} from '@nangohq/frontend'

import {HTTPError, makeUlid, z} from '@usevenice/util'

import {CANCELLATION_TOKEN} from '../frontend-utils'
import type {Id} from '../id.types'
import {extractId, makeId, zId} from '../id.types'
import type {
  IntegrationSchemas,
  IntegrationServer,
  IntHelpers,
} from '../integration.types'
import type {NangoClient, NangoProvider, UpsertIntegration} from './NangoClient'
import {zConnection, zIntegration} from './NangoClient'

export const oauthBaseSchema = {
  name: z.literal('__oauth__'), // TODO: This is a noop
  integrationConfig: z.object({
    oauth: zIntegration.pick({
      client_id: true,
      client_secret: true,
      scopes: true,
    }),
  }),
  resourceSettings: z.object({
    oauth: zConnection.pick({
      credentials: true,
      connection_config: true,
      metadata: true,
    }),
  }),
  connectOutput: z.object({
    providerConfigKey: zId('int'),
    connectionId: zId('reso'),
  }),
} satisfies IntegrationSchemas

export type OauthBaseTypes = IntHelpers<typeof oauthBaseSchema>['_types']

function isNangoAuthError(err: unknown): err is AuthError {
  return typeof err === 'object' && err != null && 'type' in err
}

export function oauthConnect({
  nangoFrontend,
  providerName,
  integrationId,
  resourceId,
}: {
  nangoFrontend: NangoFrontend
  providerName: string
  integrationId: Id['int']
  /** Should address the re-connect scenario, but let's see... */
  resourceId?: Id['reso']
}): Promise<OauthBaseTypes['connectOutput']> {
  return nangoFrontend
    .auth(integrationId, resourceId ?? makeId('reso', providerName, makeUlid()))
    .then((r) => oauthBaseSchema.connectOutput.parse(r))
    .catch((err) => {
      if (isNangoAuthError(err)) {
        if (err.type === 'user_cancelled') {
          throw CANCELLATION_TOKEN
        }
        throw new Error(`${err.type}: ${err.message}`)
      }
      throw err
    })
}

export function makeOauthIntegrationServer({
  nangoClient,
  nangoProvider,
  intId,
}: {
  nangoClient: NangoClient
  nangoProvider: NangoProvider
  intId: Id['int']
}) {
  const intServer = {
    async postConnect(connectOutput) {
      const {connectionId: resoId} = connectOutput
      const res = await nangoClient.get('/connection/{connectionId}', {
        path: {connectionId: resoId},
        query: {provider_config_key: intId, refresh_token: true},
      })
      return {resourceExternalId: extractId(resoId)[2], settings: {oauth: res}}
    },
  } satisfies IntegrationServer<typeof oauthBaseSchema>
  return {
    ...intServer,
    upsertIntegration: async (config: OauthBaseTypes['integrationConfig']) => {
      const bodyJson: UpsertIntegration = {
        provider_config_key: intId,
        provider: nangoProvider,
        oauth_client_id: config.oauth.client_id,
        oauth_client_secret: config.oauth.client_secret,
        oauth_scopes: config.oauth.scopes,
      }
      await nangoClient.put('/config', {bodyJson}).catch((err) => {
        if (
          err instanceof HTTPError &&
          err.response?.data.type === 'unknown_provider_config'
        ) {
          return nangoClient.post('/config', {bodyJson})
        }
        throw err
      })
    },
  }
}
