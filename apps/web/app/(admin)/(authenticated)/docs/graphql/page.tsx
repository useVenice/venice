'use client'

import {createGraphiQLFetcher} from '@graphiql/toolkit'
import {GraphiQL} from 'graphiql'

import {getGraphqlEndpoint} from '@usevenice/app-config/constants'
import {useConstant} from '@usevenice/ui'

import 'graphiql/graphiql.css'

export default function GraphQLExplorer() {
  const fetcher = useConstant(() =>
    createGraphiQLFetcher({url: getGraphqlEndpoint(null).pathname}),
  )

  return (
    <div className="h-full">
      <GraphiQL fetcher={fetcher}>
        <GraphiQL.Logo>
          <div />
        </GraphiQL.Logo>
      </GraphiQL>
    </div>
  )
}
