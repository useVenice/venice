import {z} from 'zod'

import type {MetaService} from '@usevenice/cdk-core'
import {makePostgresMetaService} from '@usevenice/integration-postgres'

import {createApiClient} from './api/airbyte-client.gen'

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

    const client = createApiClient(cfg.apiUrl, {
      // axiosConfig: {auth: cfg.auth}, // TODO: Fix me after zodios v11 is released
    })

    return {
      ...service,
      tables: {
        ...service.tables,
        pipeline: {
          ...service.tables.pipeline,
          list: () =>
            client
              .post('/v1/connections/list', {
                // workspaceId: cfg._temp_workspaceId,  // TODO: Fix me after zodios v11 is released
              })
              .then((res) => res as any),
        },
      },
    }
  })
