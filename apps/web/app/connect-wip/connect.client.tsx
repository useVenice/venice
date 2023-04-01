'use client'

import {Hydrate, QueryClientProvider} from '@tanstack/react-query'
import {veniceCommonConfig} from '@usevenice/app-config/commonConfig'
import React from 'react'
import superjson from 'superjson'
import type {SuperJSONResult} from 'superjson/dist/types'
import {createQueryClient} from '../../lib/query-client'
import {VeniceProvider} from '@usevenice/engine-frontend'

export function ConnectPage(props: {
  dehydratedState?: SuperJSONResult // SuperJSONResult<import('@tanstack/react-query').DehydratedState>
}) {
  const {current: queryClient} = React.useRef(createQueryClient())
  // console.log('dehydratedState', props.dehydratedState)
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate
        state={
          props.dehydratedState && superjson.deserialize(props.dehydratedState)
        }>
        <VeniceProvider
          queryClient={queryClient}
          config={veniceCommonConfig}
          accessToken={undefined}
          developerMode={false}>
          <ConnectPageInner />
        </VeniceProvider>
      </Hydrate>
    </QueryClientProvider>
  )
}

export function ConnectPageInner() {
  const {trpc} = VeniceProvider.useContext()
  const connections = trpc.listConnections.useQuery(
    {},
    {
      staleTime: 5 * 60 * 1000, // 5 mins by default, reduce refetching...
    },
  )

  return (
    <div>
      <h1>Connect page inner</h1>
      {connections.data?.map((connection) => (
        <div key={connection.id}>{connection.id}</div>
      ))}
    </div>
  )
}
