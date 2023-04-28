import type {Id} from '@usevenice/cdk-core'
import {extractId, makeId} from '@usevenice/cdk-core'
import type {IntegrationInput} from '@usevenice/engine-backend'
import {flatRouter} from '@usevenice/engine-backend'
import {getEnvVar} from '@usevenice/util'
import {contextFactory} from './backendConfig'
import type {PROVIDERS} from './env'
import {parseIntConfigsFromRawEnv} from './env'

export type _ResourceInput = IntegrationInput<(typeof PROVIDERS)[number]>

// TODO: Is this file needed? We can most likely just
// embed the functionality into venice cli directly...
export async function bootstrap() {
  // Would be nice to simplify loading of env vars from zod in a way that makes sense...
  const workspaceId = getEnvVar('WORKSPACE_ID', {required: true}) as Id['ws']

  const caller = flatRouter.createCaller(
    contextFactory.fromViewer({role: 'workspace', workspaceId}),
  )
  const configs = parseIntConfigsFromRawEnv()

  for (const [providerName, config] of Object.entries(configs ?? {})) {
    if (!config) {
      continue
    }
    const id = makeId('int', providerName, extractId(workspaceId)[1])
    await caller.adminUpsertIntegration({id, config: config as {}, workspaceId})
    console.log('Upsert integration', id)
  }
  console.log('Bootstrap complete')
}

// Can we make this a superuser trpc procedure?

if (require.main === module) {
  // eslint-disable-next-line unicorn/prefer-top-level-await
  void bootstrap()
}
