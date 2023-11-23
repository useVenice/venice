import type NangoFrontend from '@nangohq/frontend'
import type {AuthError} from '@nangohq/frontend'
import {HTTPError, makeUlid} from '@usevenice/util'
import {z} from '@usevenice/zod'
import type {
  ConnectorSchemas,
  ConnectorServer,
  ConnHelpers,
} from '../connector.types'
import {CANCELLATION_TOKEN} from '../frontend-utils'
import type {Id} from '../id.types'
import {extractId, makeId, zId} from '../id.types'
import type {NangoClient, NangoProvider, UpsertIntegration} from './NangoClient'
import {zConnection, zIntegration} from './NangoClient'

export const oauthBaseSchema = {
  name: z.literal('__oauth__'), // TODO: This is a noop
  connectorConfig: z.object({
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
    providerConfigKey: zId('ccfg'),
    connectionId: zId('reso'),
  }),
} satisfies ConnectorSchemas

export type OauthBaseTypes = ConnHelpers<typeof oauthBaseSchema>['_types']

function isNangoAuthError(err: unknown): err is AuthError {
  return typeof err === 'object' && err != null && 'type' in err
}

export function oauthConnect({
  nangoFrontend,
  connectorName,
  connectorConfigId,
  resourceId,
}: {
  nangoFrontend: NangoFrontend
  connectorName: string
  connectorConfigId: Id['ccfg']
  /** Should address the re-connect scenario, but let's see... */
  resourceId?: Id['reso']
}): Promise<OauthBaseTypes['connectOutput']> {
  return nangoFrontend
    .auth(
      connectorConfigId,
      resourceId ?? makeId('reso', connectorName, makeUlid()),
    )
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

export function makeOauthConnectorServer({
  nangoClient,
  nangoProvider,
  ccfgId,
}: {
  nangoClient: NangoClient
  nangoProvider: NangoProvider
  ccfgId: Id['ccfg']
}) {
  const connServer = {
    async postConnect(connectOutput) {
      const {connectionId: resoId} = connectOutput
      const res = await nangoClient.get('/connection/{connectionId}', {
        path: {connectionId: resoId},
        query: {provider_config_key: ccfgId, refresh_token: true},
      })
      return {resourceExternalId: extractId(resoId)[2], settings: {oauth: res}}
    },
  } satisfies ConnectorServer<typeof oauthBaseSchema>
  return {
    ...connServer,
    upsertConnectorConfig: async (
      config: OauthBaseTypes['connectorConfig'],
    ) => {
      const bodyJson: UpsertIntegration = {
        provider_config_key: ccfgId,
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
