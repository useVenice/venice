import type {Id, WebhookInput} from '@ledger-sync/cdk-core'
import {extractId, makeId} from '@ledger-sync/cdk-core'
import type {NonEmptyArray} from '@ledger-sync/util'
import {compact} from '@ledger-sync/util'

import type {AnySyncMutationInput} from './makeSyncEngine'

const kWebhook = 'webhook' as const

/** Do we also need a parseWebhookResponse? To allow setting headers, redirects and others? */
export function parseWebhookRequest(
  req: WebhookInput & {pathSegments: NonEmptyArray<string>; method?: string},
) {
  const [procedure, providerName, intExternalId] = req.pathSegments
  if (procedure !== kWebhook) {
    return {...req, procedure}
  }
  const id = makeId('int', providerName, intExternalId)
  // Consider naming it integrationId? not sure.
  const input: AnySyncMutationInput<'handleWebhook'> = [
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
  pathSegments[0] === kWebhook

parseWebhookRequest.pathOf = (intId: Id['int']) => {
  const [, providerName, intExternalId] = extractId(intId)
  return compact([kWebhook, providerName, intExternalId]).join('/')
}
