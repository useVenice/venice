import type {inferProcedureInput} from '@trpc/server'
import type {WebhookInput} from '@ledger-sync/cdk-core'
import {makeId} from '@ledger-sync/cdk-core'
import type {NonEmptyArray} from '@ledger-sync/util'
import type {makeSyncEngine} from './makeSyncEngine'

type SyncRouter = ReturnType<typeof makeSyncEngine>[1]
type HandleWebhookInput = inferProcedureInput<
  SyncRouter['_def']['mutations']['handleWebhook']
>

/** Do we also need a parseWebhookResponse? To allow setting headers, redirects and others? */
export function parseWebhookRequest(
  req: WebhookInput & {pathSegments: NonEmptyArray<string>; method?: string},
) {
  const [procedure, provider, localId] = req.pathSegments
  if (procedure !== 'webhook') {
    return {...req, procedure}
  }
  const id = makeId('int', provider, localId)
  // Consider naming it integrationId? not sure.
  const input: HandleWebhookInput = [
    {id},
    {query: req.query, headers: req.headers, body: req.body},
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
