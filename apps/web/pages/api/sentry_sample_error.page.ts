import {NextApiHandler} from 'next'
import {serverAnalytics} from '../../lib/server-analytics'

//  true
export default (async (_req, _res) => {
  serverAnalytics.track('test', {name: 'debug/debug', data: {}})
  await serverAnalytics.flush()
  // throw new Error('Sentry Backend Error')
  _res.send('Done')
}) satisfies NextApiHandler
