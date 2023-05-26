'use client'

import {createGraphiQLFetcher} from '@graphiql/toolkit'
import {GraphiQL} from 'graphiql'

import {getGraphqlEndpoint} from '@usevenice/app-config/constants'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useConstant,
} from '@usevenice/ui'

import 'graphiql/graphiql.css'

export default function GraphQLExplorer() {
  const fetcher = useConstant(() =>
    createGraphiQLFetcher({url: getGraphqlEndpoint(null).pathname}),
  )

  return (
    <div className="h-full">
      <Breadcrumb className="p-4">
        <BreadcrumbItem>
          {/* We need typed routes... https://github.com/shadcn/ui/pull/133 */}
          <BreadcrumbLink href="/api-access">API</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink href="/api-access/graphql">
            GraphQL Explorer
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <GraphiQL fetcher={fetcher}>
        <GraphiQL.Logo>
          <div />
        </GraphiQL.Logo>
      </GraphiQL>
    </div>
  )
}
