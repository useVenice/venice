'use client'

import {VeniceProvider} from '@usevenice/engine-frontend'

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
