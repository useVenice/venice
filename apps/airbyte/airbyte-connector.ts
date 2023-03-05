#!/usr/bin/env tsx

import {initTRPC} from '@trpc/server'
import {rxjs, z} from '@usevenice/util'
import {cliFromRouter} from '../cli/cli-utils'
import type {ABMessageStream} from './airbyte-protocol'
import {abMessage} from './airbyte-protocol'
import type {ConfiguredAirbyteCatalog} from './airbyte-protocol.gen'
import {readJson} from './utils'

type ConnectionSpecification = unknown // Infer from ConnectorSpecifiction['connectionSpecification']

const trpcServer = initTRPC.create()
const procedure = trpcServer.procedure

/** Implements https://docs.airbyte.com/understanding-airbyte/airbyte-protocol-docker/ */
export const router = trpcServer.router({
  spec: procedure.subscription(
    (): ABMessageStream<'SPEC'> =>
      rxjs.of(
        abMessage('SPEC', {
          documentationUrl:
            'https://docs.airbyte.io/integrations/sources/pokeapi',
          connectionSpecification: {
            $schema: 'http://json-schema.org/draft-07/schema#',
            title: 'Pokeapi Spec',
            type: 'object',
            required: ['pokemon_name'],
            properties: {
              pokemon_name: {
                type: 'string',
                description: 'Pokemon requested from the API.',
                pattern: '^[a-z0-9_\\-]+$',
                examples: ['ditto', 'luxray', 'snorlax'],
              },
            },
          },
        }),
      ),
  ),
  check: procedure
    .input(z.object({config: z.string()}))
    .subscription(({input: args}): ABMessageStream<'CONNECTION_STATUS'> => {
      const config = readJson<ConnectionSpecification>(args.config)
      return rxjs.of(
        abMessage('CONNECTION_STATUS', {status: 'SUCCEEDED', config}),
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

export const cli = cliFromRouter(router, {
  jsonOutput: true,
  consoleLog: false,
  readStdin: false,
})

if (require.main === module) {
  cli.parse(process.argv)
}
