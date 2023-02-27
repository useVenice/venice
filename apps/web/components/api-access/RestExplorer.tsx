// import '@stoplight/elements/styles.min.css' // this pollutes the global CSS space

import {API as StoplightElements} from '@stoplight/elements'
import {useQuery} from '@tanstack/react-query'
import {commonEnv} from '@usevenice/app-config/commonConfig'
import {Loading, useConstant} from '@usevenice/ui'
import {joinPath, R} from '@usevenice/util'

import type {Spec as Swagger2Spec} from 'swagger-schema-official'

export function RestExplorer() {
  const apiUrl = useConstant(
    () => new URL(joinPath(commonEnv.NEXT_PUBLIC_SUPABASE_URL, '/rest/v1/')),
  )

  const oasDocument = useQuery({
    queryKey: ['oasDocument'],
    queryFn: () =>
      fetch(
        apiUrl.href + `?apikey=${commonEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      ).then((r) => r.json()),
    select: (data: Swagger2Spec): Swagger2Spec => ({
      ...data,
      host: apiUrl.host,
      basePath: apiUrl.pathname,
      schemes: [apiUrl.protocol.replace(':', '')],
      // Stoplight does not interpret this correctly... https://github.com/stoplightio/elements/issues/2023
      security: [{ApiKeyAuth: [], BearerAuth: []}],
      // TODO: Need a way to intercept request for this to work... https://github.com/stoplightio/elements/issues/1860
      // Or would have to add a proxy endpoint... which is sad.
      securityDefinitions: {
        ApiKeyAuth: {type: 'apiKey', in: 'header', name: 'apikey'},
        BearerAuth: {type: 'apiKey', in: 'header', name: 'authorization'},
      },
      // Remove RPC calls to be less confusing for users
      paths: R.pipe(
        data.paths,
        R.toPairs,
        R.filter(([path]) => !`${path}`.startsWith('/rpc')),
        R.sortBy(([path]) => path),
        R.fromPairs,
      ) as Record<string, any>,
      definitions: R.pipe(
        data.definitions ?? {},
        R.toPairs,
        R.sortBy(([name]) => name),
        R.fromPairs,
      ) as Record<string, any>,
    }),
  })
  // console.log('oas', oasDocument.data)
  if (!oasDocument.data) {
    return <Loading />
  }

  return (
    <div className="rounded-xl bg-venice-black-300 p-2">
      <StoplightElements
        apiDescriptionDocument={oasDocument.data}
        router="hash"
      />
    </div>
  )
}
