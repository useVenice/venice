import type {Id} from '@usevenice/cdk-core'
import {extractId} from '@usevenice/cdk-core'
import {makeId} from '@usevenice/cdk-core'
import type {IntegrationInput} from '@usevenice/engine-backend'
import {getEnvVar} from '@usevenice/util'
import {veniceRouter} from './backendConfig'
import type {PROVIDERS} from './env'
import {parseIntConfigsFromRawEnv} from './env'

export type _ResourceInput = IntegrationInput<(typeof PROVIDERS)[number]>

export async function bootstrap() {
  // Would be nice to simplify loading of env vars from zod in a way that makes sense...
  const workspaceId = getEnvVar('WORKSPACE_ID', {required: true}) as Id['ws']

  const caller = veniceRouter.createCaller({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    endUserId: 'fixme' as any,
    isAdmin: true,
    workspaceId,
  })
  const configs = parseIntConfigsFromRawEnv()

  for (const [providerName, config] of Object.entries(configs ?? {})) {
    if (!config) {
      continue
    }
    const id = makeId('int', providerName, extractId(workspaceId)[1])
    await caller.adminUpsertIntegration({id, config})
    console.log('Upsert integration', id)
  }
  console.log('Bootstrap complete')
}

// Can we make this a superuser trpc procedure?

if (require.main === module) {
  // eslint-disable-next-line unicorn/prefer-top-level-await
  void bootstrap()
}
