import type {Id} from '@usevenice/cdk'
import {extractId, makeId} from '@usevenice/cdk'
import {flatRouter} from '@usevenice/engine-backend'
import {getEnvVar} from '@usevenice/util'

import {contextFactory} from './backendConfig'
import {parseIntConfigsFromRawEnv} from './connector-envs'

// TODO: Is this file needed? We can most likely just
// embed the functionality into venice cli directly...
export async function bootstrap() {
  // Would be nice to simplify loading of env vars from zod in a way that makes sense...
  const orgId = getEnvVar('ORG_ID', {required: true}) as Id['org']

  const caller = flatRouter.createCaller({
    ...contextFactory.fromViewer({role: 'org', orgId}),
    remoteResourceId: null,
  })
  const configs = parseIntConfigsFromRawEnv()

  for (const [connectorName, config] of Object.entries(configs ?? {})) {
    if (!config) {
      continue
    }
    const id = makeId('int', connectorName, extractId(orgId)[1])
    await caller.adminUpsertIntegration({id, config: config as {}, orgId})
    console.log('Upsert integration', id)
  }
  console.log('Bootstrap complete')
}

// Can we make this a superuser trpc procedure?

if (require.main === module) {
  // eslint-disable-next-line unicorn/prefer-top-level-await
  void bootstrap()
}
