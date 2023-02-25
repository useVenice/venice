import type { Fetcher} from '@graphiql/toolkit';
import {createGraphiQLFetcher} from '@graphiql/toolkit'
import {GraphiQL} from 'graphiql'
import 'graphiql/graphiql.css'

interface VeniceGraphQLExplorerProps {
  apiKey: string
}

export function VeniceGraphQLExplorer(props: VeniceGraphQLExplorerProps) {
  const {apiKey} = props

  const fetcher: Fetcher = createGraphiQLFetcher({
    url: '/v1/graphql',
    headers: {
      'x-api-key': `${apiKey}`,
    },
  })

  return (
    <div className="grow">
      <GraphiQL fetcher={fetcher} />
    </div>
  )
}
