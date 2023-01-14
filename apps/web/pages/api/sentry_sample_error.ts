import type {NextApiHandler} from 'next'

import {R} from '@usevenice/util'

export default R.identity<NextApiHandler>((_req, _res) => {
  throw new Error('Sentry Backend Error')
})
