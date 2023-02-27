import '@stoplight/elements/styles.min.css' // this pollutes the global CSS space

import {API as StoplightElements} from '@stoplight/elements'
import {useQuery} from '@tanstack/react-query'
import {Loading} from '@usevenice/ui'
import {R} from '@usevenice/util'

import {restEndpoint} from '@usevenice/app-config/constants'
import type {Spec as Swagger2Spec} from 'swagger-schema-official'

export default function RestExplorerPage() {
  const oasDocument = useQuery({
    queryKey: ['oasDocument'],
    queryFn: () => fetch(restEndpoint.href).then((r) => r.json()),
    select: (data: Swagger2Spec): Swagger2Spec => ({
      // TODO: move this logic to server side [[...rest]] endpoint later.
      // Need ot use selfHandleResponse and modify the response body json before
      // being sent back down to the client...
      ...data,
      host: restEndpoint.host,
      basePath: restEndpoint.pathname,
      info: {
        description:
          'Venice: open source infrastructure to enable the frictionless movement of financial data.',
        title: 'Venice REST API',
        version: '2023-02-26',
      },
      schemes: [restEndpoint.protocol.replace(':', '')],
      // Remove RPC calls to be less confusing for users
      paths: R.pipe(
        data.paths,
        R.toPairs,
        R.filter(([path]) => !path.startsWith('/rpc')),
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
    <div className="elements-container">
      <StoplightElements
        apiDescriptionDocument={oasDocument.data}
        router="hash"
        // We have to use this because adding search to pathPath does not work
        // as it gets escaped... with include policy the proxy will use the
        // cookie to authenticate us before passing it on
        tryItCredentialsPolicy="include"
      />
    </div>
  )
}
