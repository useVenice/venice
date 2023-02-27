import {createGraphiQLFetcher} from '@graphiql/toolkit'
import {commonEnv} from '@usevenice/app-config/commonConfig'
import {useConstant} from '@usevenice/ui'
import {joinPath} from '@usevenice/util'
import {GraphiQL} from 'graphiql'
import 'graphiql/graphiql.css'
import React from 'react'
import {useSession} from '../../contexts/session-context'

export function GraphQLExplorer() {
  const [session] = useSession()

  const apiUrl = joinPath(commonEnv.NEXT_PUBLIC_SUPABASE_URL, '/graphql/v1')
  const fetcher = useConstant(() => createGraphiQLFetcher({url: apiUrl}))
  const headersString = React.useMemo(
    () =>
      JSON.stringify(
        {
          apikey: commonEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          authorization: `Bearer ${session?.access_token}`,
        },
        null,
        4,
      ),
    [session?.access_token],
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
