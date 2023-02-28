import '@usevenice/app-config/register.node'
import {inngest} from '@usevenice/engine-backend'
import {fromMaybeArray, makeUlid} from '@usevenice/util'

import {NextApiHandler} from 'next'

export default (async (req, res) => {
  const {webhook, ...query} = req.query
  // Workaround for lack of response from inngest.send https://discord.com/channels/842170679536517141/845000011040555018/1080057253060694036
  const traceId = makeUlid()
  // TODO: Figure out a way to handle webhook within current request to help with debugging
  // Or at least validating the request for things like HMAC signature and payload formatting
  await inngest.send('webhook/received', {
    data: {
      traceId,
      method: req.method ?? '',
      headers: req.headers ?? {},
      path: fromMaybeArray(webhook ?? '').join('/'),
      query,
      body: req.body,
    },
  })
  res.send({status: 'queued', traceId})
}) satisfies NextApiHandler
