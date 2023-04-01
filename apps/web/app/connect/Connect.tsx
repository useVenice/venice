'use client'

import type {ConnectWith, Id} from '@usevenice/cdk-core'
import type {AnySyncRouterOutput} from '@usevenice/engine-backend'
import type {UseVenice} from '@usevenice/engine-frontend'
import {useVenice, VeniceProvider} from '@usevenice/engine-frontend'
import {AddFilledIcon} from '@usevenice/ui/icons'
import Image from 'next/image'
import React from 'react'
import {
  ConnectionCard,
  ConnectionCardSkeleton,
} from '../../components/connections'
import {LoadingIndicatorOverlayV2} from '../../components/loading-indicators'
import {PageHeader} from '../../components/PageHeader'
import {ResourceCard} from '../../components/ResourceCard'
import type {Connection} from '../../lib/supabase-queries'

export function Connect(props: {
  integrations: AnySyncRouterOutput['listIntegrations']
  displayName?: string
  ledgerIds: Array<Id['reso']>
}) {
  const {trpc} = VeniceProvider.useContext()
  const trpcCtx = trpc.useContext()
  const connections = trpc.listConnections.useQuery({})

  // TODO: Need to have default preConnectInput values for prefetch to work properly
  // Ideally this can work like a streaming react server component where we start
  // prefetching server side and then send down to the client when data is ready async
  // but not block the initial page load. Currently we have to wait for the client to
  // load the page and then issue the prefetch request, wasting a roundtrip time
  // but still better than blocking page load as users are probably not going to
  // connect immediately, until we have a dedicated screen for immediate connect anyways.
  React.useEffect(() => {
    props.integrations.forEach((int) =>
      trpcCtx.preConnect.prefetch([
        {id: int.id as never},
        {envName: 'sandbox'},
        {},
      ]),
    )
  }, [props.integrations, trpcCtx])

  return (
    <div>
      <PageHeader title={[props.displayName ?? '']}></PageHeader>
      <div className="flex gap-36 px-16 pt-8">
        {connections.isLoading ? (
          <LoadingConnectionsColumn />
        ) : (
          <ConnectionsColumn
            connections={
              connections.data?.filter((c) => c.type === 'source') ?? []
            }
            connectWith={{destinationId: props.ledgerIds[0]}}
          />
        )}
      </div>
    </div>
  )
}

function LoadingConnectionsColumn() {
  return (
    <section className="flex w-[24rem] shrink-0 flex-col gap-4">
      <header className="flex items-center">
        <h2 className="flex grow items-center gap-2">
          <Image
            width={30}
            height={30}
            src="/pipeline-in.svg"
            alt="" // decorative image
            aria-hidden="true"
          />
          <span className="text-sm uppercase">Connections</span>
        </h2>
      </header>
      <ConnectionCardSkeleton />
      <ConnectionCardSkeleton />
    </section>
  )
}

interface ConnectionsColumnProps {
  connections: Connection[]
  connectWith: ConnectWith
}

function ConnectionsColumn(props: ConnectionsColumnProps) {
  const {connections, connectWith} = props

  const {integrationsRes, veniceConnect, checkResource}: UseVenice = useVenice({
    envName: 'sandbox',
    keywords: undefined,
  })

  const onlyIntegrationId =
    integrationsRes.data?.length === 1 ? integrationsRes.data[0]?.id : undefined

  function addNewConnection() {
    if (onlyIntegrationId) {
      void veniceConnect.connect({id: onlyIntegrationId}, {connectWith})
    }
  }

  return (
    <section className="flex w-[24rem] shrink-0 flex-col gap-4">
      <header className="flex items-center">
        <h2 className="flex grow items-center gap-2">
          <Image
            width={30}
            height={30}
            src="/pipeline-in.svg"
            alt="" // decorative image
            aria-hidden="true"
          />
          <span className="text-sm uppercase">Connections</span>
        </h2>
        {connections.length > 0 && (
          <button
            onClick={addNewConnection}
            className="h-5 w-5 fill-current text-green hover:text-opacity-70 focus:outline-none focus-visible:text-opacity-70">
            <AddFilledIcon />
          </button>
        )}
      </header>
      {connections.length > 0 ? (
        connections.map((source) => (
          <ConnectionCard
            key={source.id}
            connection={source}
            onReconnect={() => {
              if (onlyIntegrationId) {
                void veniceConnect.connect(
                  {id: onlyIntegrationId},
                  {connectWith, resourceId: source.resource.id},
                )
              } else {
                console.error('Missing onlyIntegrationId')
              }
            }}
            onSandboxSimulateDisconnect={() =>
              checkResource.mutate([
                {id: source.resource.id},
                {sandboxSimulateDisconnect: true},
              ])
            }
          />
        ))
      ) : (
        <>
          <ResourceCard
            tagColor="offwhite"
            bgColor="bg-gradient-to-r from-[#ECAA47] to-[#722273]">
            <button
              className="flex items-center justify-center gap-2 px-3 py-2 text-offwhite hover:bg-venice-black/10 focus:outline-none focus-visible:bg-venice-black/10"
              onClick={addNewConnection}>
              <AddFilledIcon className="inline-flex h-5 w-5 fill-current" />
              <span className="text-sm uppercase">Add new source</span>
            </button>
          </ResourceCard>
          <div className="grid gap-4 px-2 text-center text-sm text-venice-gray">
            <p>
              Venice has over 12,000 financial data sources to choose from (e.g.
              banks & investments)
            </p>
            <p>
              Don&apos;t see one you need?{' '}
              <a
                className="text-green hover:text-opacity-70"
                href="mailto:hi@venice.is">
                Reach&nbsp;out!
              </a>
            </p>
          </div>
        </>
      )}

      {veniceConnect.isConnecting && <LoadingIndicatorOverlayV2 />}
    </section>
  )
}
