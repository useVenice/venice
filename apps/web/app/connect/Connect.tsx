'use client'

import type {Id, ZStandard} from '@usevenice/cdk-core'
import type {RouterOutput} from '@usevenice/engine-backend'
import type {UseVenice} from '@usevenice/engine-frontend'
import {useVenice, VeniceProvider} from '@usevenice/engine-frontend'
import {AddFilledIcon} from '@usevenice/ui/icons'
import {ChevronLeft} from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import {
  ConnectionCard,
  ConnectionCardSkeleton,
} from '../../components/connections'
import {LoadingIndicatorOverlayV2} from '../../components/loading-indicators'
import {PageHeader} from '../../components/PageHeader'
import {TaggedCard} from '../../components/TaggedCard'
import type {Connection} from '../../lib/supabase-queries'

export function Connect(props: {
  integrations: RouterOutput['listIntegrations']
  displayName?: string
  redirectUrl?: string
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
      trpcCtx.preConnect.prefetch([int.id, {envName: 'sandbox'}, {}]),
    )
  }, [props.integrations, trpcCtx])

  return (
    <div>
      <PageHeader title={[props.displayName ?? '']}>
        {props.redirectUrl && (
          <a
            href={props.redirectUrl}
            className="flex h-8 shrink-0 items-center gap-1 rounded bg-venice-black-500 px-2 hover:opacity-90">
            <ChevronLeft className="inline-flex h-4 w-4 fill-current text-offwhite" />
            <span className="text-xs uppercase">Back</span>
          </a>
        )}
      </PageHeader>
      <div className="flex flex-wrap gap-36 px-16 pt-8">
        {connections.isLoading ? (
          <LoadingConnectionsColumn />
        ) : (
          <>
            <ConnectionsColumn
              connections={
                connections.data?.filter((c) => c.type === 'source') ?? []
              }
              category="banking"
              title="Bank accounts"
              integrationId="int_plaid"
            />
            <ConnectionsColumn
              connections={
                connections.data?.filter((c) => c.type === 'source') ?? []
              }
              category="accounting"
              title="Accounting software"
              integrationId="int_merge"
            />
            <ConnectionsColumn
              connections={
                connections.data?.filter((c) => c.type === 'source') ?? []
              }
              category="hris"
              title="Payroll system"
              integrationId="int_merge"
              preConnectInput={{categories: ['hris']}}
            />
          </>
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
  category?: NonNullable<ZStandard['institution']['categories']>[number]
  /** TODO: Should be inferred based on `category` specified above */
  integrationId?: Id['int']
  /** Could also be inferred based on category */
  title?: string
  /** TODO: Fix me... typing and hard-coding not ideal */
  preConnectInput?: unknown
}

function ConnectionsColumn(props: ConnectionsColumnProps) {
  const {title, preConnectInput} = props
  const connections = props.connections.filter(
    (c) =>
      !props.category || c.institution?.categories?.includes(props.category),
  )

  const {integrationsRes, veniceConnect, checkResource}: UseVenice = useVenice({
    envName: 'sandbox',
    keywords: undefined,
    enablePreconnectPrompt: false,
  })

  /** Ensure the integration actually exists... */
  const integrationId = integrationsRes.data?.find(
    (int) => int.id === props.integrationId,
  )?.id

  function addNewConnection() {
    if (integrationId) {
      void veniceConnect.connect({id: integrationId}, {preConnectInput})
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
          <span className="text-xl uppercase">{title ?? 'Connections'}</span>
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
              if (integrationId) {
                void veniceConnect.connect(
                  {id: integrationId},
                  {resourceId: source.id},
                )
              } else {
                console.error('Missing onlyIntegrationId')
              }
            }}
            onSandboxSimulateDisconnect={() =>
              checkResource.mutate([
                source.id,
                {sandboxSimulateDisconnect: true},
              ])
            }
          />
        ))
      ) : (
        <>
          <TaggedCard
            tagColor="offwhite"
            bgColor="bg-gradient-to-r from-[#ECAA47] to-[#722273]">
            <button
              className="flex items-center justify-center gap-2 px-3 py-2 text-offwhite hover:bg-venice-black/10 focus:outline-none focus-visible:bg-venice-black/10"
              onClick={addNewConnection}>
              <AddFilledIcon className="inline-flex h-5 w-5 fill-current" />
              <span className="text-sm uppercase">Add new connection</span>
            </button>
          </TaggedCard>
        </>
      )}

      {veniceConnect.isConnecting && <LoadingIndicatorOverlayV2 />}
    </section>
  )
}
