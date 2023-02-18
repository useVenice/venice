import {NextApiHandler} from 'next'

export default ((_req, _res) => 
   true
  // throw new Error('Sentry Backend Error')
) satisfies NextApiHandler
