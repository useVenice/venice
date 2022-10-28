import '@usevenice/app-config/register.node'

import type {NextApiHandler} from 'next'

import {R} from '@usevenice/util'
import {runWorker} from '@usevenice/worker'

export default R.identity<NextApiHandler>(async (req, res) => {
  // Is this necessary? Can be useful for admin console though
  // https://vercel.com/support/articles/how-to-enable-cors
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')
  if (req.method === 'OPTIONS') {
    console.log('Respond to OPTIONS request')
    res.status(200).end()
    return
  }
  // 10 seconds for vercel personal plan and 60 seconds for team plan
  // So we default to 9 seconds.
  // TODO: Add authentication to prevent unauthorized invocation
  await runWorker({timeout: 9000})
  res.send('Ok')
})
