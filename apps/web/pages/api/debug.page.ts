import {NextApiHandler} from 'next'

export default ((_req, res) => {
  res.send({ok: true})
}) satisfies NextApiHandler
