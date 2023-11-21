import {formatDistanceToNowStrict} from 'date-fns'
import {Landmark} from 'lucide-react'

import type {ZStandard} from '@usevenice/cdk'
import type {RouterOutput} from '@usevenice/engine-backend'

import {LoadingText} from '../components/LoadingText'
import {Badge, Card} from '../shadcn'
import {cn} from '../utils'
import type {ConnectorMeta, UIProps, UIPropsNoChildren} from './ConnectorCard'
import {ConnectorLogo} from './ConnectorCard'

type Resource = RouterOutput['listConnections'][number]

export const ResourceCard = ({
  resource,
  connector,
  children,
  className,
  ...uiProps
}: UIProps & {
  resource: Resource
  connector: ConnectorMeta
}) => (
  <Card
    className={cn(
      'm-3 flex h-36 w-36 flex-col items-center p-2 sm:h-48 sm:w-48',
      className,
    )}>
    <div className="flex h-6 items-center justify-between self-stretch">
      <Badge
        variant="secondary"
        className={cn(
          resource.status === 'healthy' && 'bg-green-200',
          resource.status === 'manual' && 'bg-blue-200',
          (resource.status === 'error' || resource.status === 'disconnected') &&
            'bg-pink-200',
        )}>
        {resource.syncInProgress ? 'Syncing' : resource.status}
      </Badge>
      <span className="ml-2 truncate text-right text-xs">
        {resource.syncInProgress ? (
          <LoadingText text="Syncing" />
        ) : resource.lastSyncCompletedAt ? (
          `Synced ${formatDistanceToNowStrict(
            new Date(resource.lastSyncCompletedAt),
            {addSuffix: true},
          )}`
        ) : (
          'No sync information'
        )}
      </span>
    </div>

    {resource.integrationId ? (
      <IntegrationLogo
        {...uiProps}
        integration={resource.integration}
        className="grow"
      />
    ) : (
      <ConnectorLogo {...uiProps} connector={connector} className="grow" />
    )}

    {/* connector config id / provider name */}
    {/* Integration logo with name */}
    {/* Connection status / last synced time */}
    {/* Reconnect button */}
    {/* Do we want drop down menu? */}
    {/* Renaming (display name) */}
    {/* Deleting */}
    {children}
  </Card>
)

export function IntegrationLogo({
  integration,
  className,
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  Image = (props) => <img {...props} />,
}: UIPropsNoChildren & {
  integration?: ZStandard['integration'] | null | undefined
}) {
  return integration?.logoUrl ? (
    <Image
      src={integration.logoUrl}
      alt={`"${integration.name}" logo`}
      className={cn(
        'h-12 w-12 shrink-0 overflow-hidden object-contain',
        className,
      )}
    />
  ) : (
    <div
      className={cn(
        'flex h-12 shrink-0 items-center justify-center rounded-lg',
        className,
      )}>
      <Landmark />
    </div>
  )
}
