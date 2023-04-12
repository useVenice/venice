'use client'

import type {AnySyncRouterOutput} from '@usevenice/engine-backend'
import {VeniceProvider} from '@usevenice/engine-frontend'
import {CopyTextIcon, Loading, SyncIcon} from '@usevenice/ui'
import {formatDistanceToNowStrict} from 'date-fns'
import {copyToClipboard} from '../contexts/common-contexts'
import {ResourceCard} from './ResourceCard'
import {
  ActionMenu,
  ActionMenuItem,
} from './connections/ConnectionCard/ActionMenu'

export function PipelinesTable(props: {
  pipelines: AnySyncRouterOutput['listPipelines']
}) {
  const {trpc} = VeniceProvider.useContext()
  const dispatch = trpc.dispatch.useMutation()
  return (
    <table className="table-auto">
      <thead>
        <tr className="">
          {/* <th className="p-4">Name</th> */}
          <th className="p-4">Source</th>
          <th className="p-4">Destination</th>
          <th className="p-4">Last Sync</th>
          <th className="p-4"></th>
        </tr>
      </thead>
      <tbody>
        {props.pipelines.map((pipe) => (
          <tr key={pipe.id}>
            {/* <td className="p-4">{pipe.id}</td> */}
            <td className="p-4">
              {pipe.source && <ResourceCard resource={pipe.source} />}
            </td>
            <td className="p-4">
              {pipe.destination && <ResourceCard resource={pipe.destination} />}
            </td>
            <td className="p-4">
              <p className="text-sm font-medium text-venice-gray">
                {pipe.syncInProgress ? (
                  <Loading text="Syncing" />
                ) : pipe.lastSyncCompletedAt ? (
                  `${formatDistanceToNowStrict(
                    new Date(pipe.lastSyncCompletedAt),
                    {addSuffix: true},
                  )}`
                ) : (
                  'No sync information'
                )}
              </p>
            </td>
            <td className="p-4">
              <ActionMenu className="ml-auto">
                {/* This is not working... */}
                <ActionMenuItem
                  icon={CopyTextIcon}
                  label="Copy Id"
                  onClick={() => {
                    void copyToClipboard(pipe.id)
                  }}
                />
                <ActionMenuItem
                  icon={SyncIcon}
                  label="Sync"
                  // TODO: show sync in progress and result (success/failure)
                  onClick={() =>
                    dispatch.mutate({
                      name: 'sync/pipeline-requested',
                      data: {pipelineId: pipe.id},
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
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
