'use client'

import {VeniceProvider} from '@usevenice/engine-frontend'

export function Connect() {
  const {trpc} = VeniceProvider.useContext()
  const connections = trpc.listConnections.useQuery({})

  return (
    <div>
      <h1>Connect page inner</h1>
      {connections.data?.map((connection) => (
        <div key={connection.id}>{connection.id}</div>
      ))}
    </div>
  )
}
