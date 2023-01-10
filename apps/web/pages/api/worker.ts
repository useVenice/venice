import '@usevenice/app-config/register.node'

import type {NextApiHandler} from 'next'

import {backendEnv} from '@usevenice/app-config/backendConfig'
import {R} from '@usevenice/util'
import {runWorker} from '@usevenice/worker'

import {respondToCORS} from './trpc/[...trpc]'

export default R.identity<NextApiHandler>(async (req, res) => {
  // Is this necessary? Can be useful for admin console though
  if (respondToCORS(req, res)) {
    return
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const secret = req.body.secret || req.query['secret']
  if (secret !== backendEnv.WORKER_INVOCATION_SECRET) {
    res.status(401).send('WORKER_INVOCATION_SECRET required')
    return
  }
  // 10 seconds for vercel personal plan and 60 seconds for team plan
  // So we default to 9 seconds (for idle anyways). This makes all forms of incremental sync super important.

  await runWorker({timeout: 9000})
  res.send('Ok')
})
