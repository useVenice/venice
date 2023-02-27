import {createGraphiQLFetcher} from '@graphiql/toolkit'
import {graphqlEndpoint, xPatHeaderKey} from '@usevenice/app-config/constants'
import {useConstant} from '@usevenice/ui'
import {GraphiQL} from 'graphiql'
import 'graphiql/graphiql.css'
import React from 'react'

export function GraphQLExplorer({pat}: {pat?: string}) {
  const fetcher = useConstant(() =>
    createGraphiQLFetcher({url: graphqlEndpoint.pathname}),
  )
  const headersString = React.useMemo(
    () => JSON.stringify({[xPatHeaderKey]: pat}, null, 4),
    [pat],
  )

  return (
    <div className="grow">
      <GraphiQL
        fetcher={fetcher}
        defaultHeaders={headersString}
        defaultQuery={`{
  transactionCollection {
    edges {
      node{
        id
        description
        amountUnit
        amountQuantity
        account {
          id
          name
        }
      }
    }
  }
}`}>
        <GraphiQL.Logo>
          <div />
        </GraphiQL.Logo>
      </GraphiQL>
    </div>
  )
}
