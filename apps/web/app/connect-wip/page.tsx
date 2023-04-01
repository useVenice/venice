import '@usevenice/app-config/register.node'

import {makeJwtClient} from '@usevenice/engine-backend'

import {z} from '@usevenice/util'

export const metadata = {
  title: 'Venice Connect',
}

const jwtClient = makeJwtClient({
  // app-config/backendConfig does not work inside server components, so we will have to use this for now...
  secretOrPublicKey: process.env['JWT_SECRET_OR_PUBLIC_KEY']!, //  backendEnv.JWT_SECRET_OR_PUBLIC_KEY!,
})

/** https://beta.nextjs.org/docs/api-reference/file-conventions/page#searchparams-optional */
export default function Connect({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>
}) {
  const token = z.string().parse(searchParams['token'])
  const payload = jwtClient.verify(token)

  return <h1>Venice connect {JSON.stringify(payload, null, 2)}</h1>
}
