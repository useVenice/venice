import type {makeSyncEngine} from './makeSyncEngine'
import type {IntId, WebhookInput} from '@ledger-sync/cdk-core'
import type {NonEmptyArray} from '@ledger-sync/util'
import type {inferProcedureInput} from '@trpc/server'

type SyncRouter = ReturnType<typeof makeSyncEngine>[1]
type HandleWebhookInput = inferProcedureInput<
  SyncRouter['_def']['mutations']['handleWebhook']
>

export function parseWebhookRequest(
  req: WebhookInput & {pathSegments: NonEmptyArray<string>; method?: string},
) {
  const [procedure, provider, localId] = req.pathSegments
  if (procedure !== 'webhook') {
    return {...req, procedure}
  }
  const id = localId ? (`int_${provider}_${localId}` as IntId) : undefined
  const input: HandleWebhookInput = [
    // Consider naming it integrationId? not sure.
    id ? {id} : {provider},
    {
      query: req.query,
      headers: req.headers,
      body: req.body,
    },
  ]
  return {
    ...req,
    procedure: 'handleWebhook',
    // Need to stringify because of getRawProcedureInputOrThrow
    ...(req.method?.toUpperCase() === 'GET'
      ? {query: {...req.query, input: JSON.stringify(input)}}
      : {body: input}),
  }
}
parseWebhookRequest.isWebhook = (pathSegments: NonEmptyArray<string>) =>
  pathSegments[0] === 'webhook'
