'use client'

import type {AnySyncRouterOutput} from '@usevenice/engine-backend'
import {VeniceProvider} from '@usevenice/engine-frontend'
import {CopyTextIcon, SyncIcon} from '@usevenice/ui'
import Image from 'next/image'
import {copyToClipboard} from '../contexts/common-contexts'
import {TaggedCard} from './TaggedCard'
import {
  ActionMenu,
  ActionMenuItem,
} from './connections/ConnectionCard/ActionMenu'

type Resource = NonNullable<
  AnySyncRouterOutput['listPipelines'][number]['source']
>

export function ResourceCard(props: {resource: Resource}) {
  const {
    id: resourceId,
    displayName,
    institution,
    status,
    labels = [],
    providerName,
  } = props.resource
  const {trpc} = VeniceProvider.useContext()
  const dispatch = trpc.dispatch.useMutation()
  return (
    <TaggedCard
      tagColor={status === 'disconnected' ? 'venice-red' : 'venice-green'}
      className="min-h-0">
      <div className="flex grow flex-col justify-between py-2 px-3">
        <div className="flex items-center gap-1">
          {institution?.logoUrl ? (
            <Image
              width={32}
              height={32}
              src={institution.logoUrl}
              alt={`${institution.name} Logo`}
            />
          ) : (
            <Image
              width={32}
              height={32}
              src="/institution-placeholder.svg"
              alt=""
              aria-hidden="true"
            />
          )}
          <span className="flex gap-1 px-1">
            {[providerName, ...labels].map((l) => (
              <span className="text-sm font-medium text-venice-gray" key={l}>
                {l}
              </span>
            ))}
          </span>
          <span className="truncate text-sm font-medium uppercase">
            {displayName.toLowerCase() === providerName.toLowerCase()
              ? ''
              : displayName}
          </span>

          <ActionMenu className="ml-auto">
            <ActionMenuItem
              icon={CopyTextIcon}
              label="Copy Id"
              onClick={() => {
                void copyToClipboard(resourceId)
              }}
            />
            <ActionMenuItem
              icon={SyncIcon}
              label="Sync"
              // TODO: show sync in progress and result (success/failure)
              onClick={() =>
                dispatch.mutate({
                  name: 'sync/resource-requested',
                  data: {resourceId},
                })
              }
            />
            {/* {status === 'healthy' && labels.includes('sandbox') && (
              <ActionMenuItem
                icon={Lucide.Unlink}
                label="Simulate disconnect"
                onClick={() => props.onSandboxSimulateDisconnect?.()}
              />
            )} */}
          </ActionMenu>
        </div>
        {/* <div className="flex flex-row">

          <div className="ml-auto text-right">
            {status ? <ResourceStatus status={status} /> : null}
          </div>
        </div> */}
      </div>
    </TaggedCard>
  )
}
