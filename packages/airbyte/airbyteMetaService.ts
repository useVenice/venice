import createClient from 'openapi-fetch'
import {z} from 'zod'

import type {MetaService} from '@usevenice/cdk-core'
import {makePostgresMetaService} from '@usevenice/integration-postgres'
// import {createApiClient} from './api/airbyte-private-api.gen'

import type {InfoFromPaths} from '@usevenice/util'
import {makeOpenApiClient} from '@usevenice/util'

import type {paths} from './api/airbyte-private-api.gen'

const http = createClient<paths>({baseUrl: 'https://platform.brexapis.com'})

const client = makeOpenApiClient<InfoFromPaths<paths>>({
  baseUrl: 'https://platform.brexapis.com', // TODO: get this from openAPI.json
})

const zAirbyteMetaConfig = z.object({
  postgresUrl: z.string(),
  apiUrl: z.string(),
  auth: z.object({
    username: z.string(),
    password: z.string(),
  }),
  _temp_workspaceId: z.string(),
})

export const makeAirbyteMetaService = z
  .function()
  .args(zAirbyteMetaConfig)
  .implement((cfg): MetaService => {
    const service = makePostgresMetaService({
      databaseUrl: cfg.postgresUrl,
      viewer: {role: 'system'},
    })

    // const client = createApiClient(cfg.apiUrl, {
    //   // axiosConfig: {auth: cfg.auth},
    // })

    void http
      .POST('/v1/connections/list', {
        body: {workspaceId: ''},
        // workspaceId: cfg._temp_workspaceId,
      })
      .then((res) => res as any)

    return {
      ...service,
      tables: {
        ...service.tables,
        pipeline: {
          ...service.tables.pipeline,
          list: () =>
            client
              .post('/v1/connections/list', {
                bodyJson: {
                  workspaceId: '',
                },
                // workspaceId: cfg._temp_workspaceId,
              })
              .then((res) => res.connections as any),
        },
      },
    }
  })
