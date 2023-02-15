import {NextApiHandler} from 'next'

export default ((_req, _res) => {
  throw new Error('Sentry Backend Error')
}) satisfies NextApiHandler
