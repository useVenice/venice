#!/usr/bin/env tsx
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// Airbyte connectors will only run in node env anyways.
import '@usevenice/app-config/register.node'

import {initTRPC} from '@trpc/server'
import {fromMaybePromise, rxjs, z} from '@usevenice/util'
import type {AnySyncProvider} from '@usevenice/cdk-core'
import {cliFromRouter} from '../cli/cli-utils'
import type {ABMessageStream} from './airbyte-protocol'
import {abMessage} from './airbyte-protocol'
import type {ConfiguredAirbyteCatalog} from './airbyte-protocol.gen'
import {readJson} from './utils'
import zodToJsonSchema from 'zod-to-json-schema'

const trpcServer = initTRPC.create()
const procedure = trpcServer.procedure

export function makeAirbyteConnector(provider: AnySyncProvider) {
  const connSpec = z.object({
    settings: provider.def.resourceSettings ?? z.object({}),
    // For now, unclear whether it should actually live in airbyte config
    // or perhaps it should just have a `veniceIntegrationId` field
    // so the data is not duplicated across dozens of integrations
    // but then we'd have to think about "auth", or at least the integrationId would have to be
    // made a secret field too
    config: provider.def.integrationConfig ?? z.object({}),
  })
  type ConnectionSpecification = z.infer<typeof connSpec>

  /** Implements https://docs.airbyte.com/understanding-airbyte/airbyte-protocol-docker/ */
  const router = trpcServer.router({
    spec: procedure.subscription(
      (): ABMessageStream<'SPEC'> =>
        rxjs.of(
          abMessage('SPEC', {
            // Default version is 0.2.0
            protocol_version: '0.2.0',
            documentationUrl: `https://github.com/useVenice/venice/tree/main/integrations/integration-${provider.name}`,
            // Add all the other stuff we support
            connectionSpecification: zodToJsonSchema(
              z.object({
                settings: provider.def.resourceSettings ?? z.object({}),
                // For now, unclear whether it should actually live in airbyte config
                // or perhaps it should just have a `veniceIntegrationId` field
                // so the data is not duplicated across dozens of integrations
                // but then we'd have to think about "auth", or at least the integrationId would have to be
                // made a secret field too
                config: provider.def.integrationConfig ?? z.object({}),
              }),
            ),
          }),
        ),
    ),
    check: procedure
      .input(z.object({config: z.string()}))
      .subscription(({input: args}): ABMessageStream<'CONNECTION_STATUS'> => {
        const config = readJson<ConnectionSpecification>(args.config)
        return rxjs.from(
          fromMaybePromise(
            provider.checkResource?.({
              settings: config.settings,
              config: config.config,
              options: {skipCache: true},
              context: {webhookBaseUrl: ''},
            }),
          )
            // TODO: does checkResource return resourceUpdate non-standard also?
            .then(() => abMessage('CONNECTION_STATUS', {status: 'SUCCEEDED'}))
            .catch((err) =>
              abMessage('CONNECTION_STATUS', {
                status: 'FAILED',
                message: `${err}`,
              }),
            ),
        )
      }),
    discover: procedure
      .input(z.object({config: z.string()}))
      .subscription(({input: args}): ABMessageStream<'CATALOG'> => {
        const config = readJson<ConnectionSpecification>(args.config)
        return rxjs.of(
          abMessage('CATALOG', {
            config,
            streams: [
              {
                name: 'pokemon',
                json_schema: {
                  properties: {
                    id: {type: 'string'},
                    haha: {type: 'string'},
                  },
                },
                supported_sync_modes: ['full_refresh'],
              },
            ],
          }),
        )
      }),
    read: procedure
      .input(
        z.object({
          config: z.string(),
          catalog: z.string(),
          state: z.string().optional(),
        }),
      )
      .subscription(({input: args}): ABMessageStream<'RECORD' | 'STATE'> => {
        const config = readJson<ConnectionSpecification>(args.config)
        const catalog = readJson<ConfiguredAirbyteCatalog>(args.catalog)
        const state = args.state ? readJson(args.state) : {}

        return rxjs.from(
          Array(10)
            .fill(0)
            .map((_, i) =>
              abMessage('RECORD', {
                stream: 'pokemon',
                data: {
                  id: `rec_${i}`,
                  haha: 'ssup',
                },
                emitted_at: Date.now(),
                config,
                catalog,
                state,
              }),
            ),
        )
      }),
  })

  const cli = cliFromRouter(router, {
    jsonOutput: true,
    consoleLog: false,
    readStdin: false,
  })

  return {router, cli}
}
