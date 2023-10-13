import {formatDistanceToNowStrict} from 'date-fns'
import {Landmark} from 'lucide-react'
import React from 'react'

import type {Id, ZStandard} from '@usevenice/cdk-core'
import type {RouterOutput} from '@usevenice/engine-backend'

import {LoadingText} from '../components/LoadingText'
import {Badge, Card} from '../shadcn'
import {cn} from '../utils'

/** Can be img or next/image component */
export type ImageComponent = React.FC<
  Omit<
    React.DetailedHTMLProps<
      React.ImgHTMLAttributes<HTMLImageElement>,
      HTMLImageElement
    >,
    'loading' | 'ref'
  >
>

export interface UIPropsNoChildren {
  className?: string
  Image?: ImageComponent
}

export interface UIProps extends UIPropsNoChildren {
  children?: React.ReactNode
}

type Resource = RouterOutput['listConnections'][number]
type ProviderMeta = RouterOutput['getIntegrationCatalog'][string]

export const ResourceCard = ({
  resource,
  provider,
  children,
  className,
  ...uiProps
}: UIProps & {
  resource: Resource
  provider: ProviderMeta
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

    {resource.institutionId ? (
      <InstitutionLogo
        {...uiProps}
        institution={resource.institution}
        className="grow"
      />
    ) : (
      <ProviderLogo {...uiProps} provider={provider} className="grow" />
    )}

    {/* Integration id / provider name */}
    {/* Institution logo with name */}
    {/* Connection status / last synced time */}
    {/* Reconnect button */}
    {/* Do we want drop down menu? */}
    {/* Renaming (display name) */}
    {/* Deleting */}
    {children}
  </Card>
)

export const IntegrationCard = ({
  integration: int,
  ...props
}: React.ComponentProps<typeof ProviderCard> & {
  integration: {
    id: Id['int']
    providerName: string
    config?: Record<string, unknown> | null
  }
}) => (
  <ProviderCard
    {...props}
    showName={false}
    // Temporary hack due to presence of labels for plaid. Need better design for ProviderCard and IntegrationCard
    labels={
      // TODO: Fix this hack soon. We should have some kind of mapStandardIntegration method
      int.config?.['envName']
        ? // eslint-disable-next-line @typescript-eslint/no-base-to-string
          [`${int.config?.['envName']}`]
        : []
    }
  />
)

export const ProviderCard = ({
  provider,
  showStageBadge = false,
  showName = true,
  labels = [],
  className,
  children,
  ...uiProps
}: UIProps & {
  provider: ProviderMeta
  showStageBadge?: boolean
  labels?: string[]
  showName?: boolean
}) => (
  <Card
    className={cn(
      'm-3 flex h-36 w-36 flex-col items-center p-2 sm:h-48 sm:w-48',
      className,
    )}>
    <div className="flex h-6 self-stretch">
      {showName && (
        <span className="text-sm text-muted-foreground">{provider.name}</span>
      )}
      {labels.map((label) => (
        <Badge key={label} variant="secondary">
          {label}
        </Badge>
      ))}
      {showStageBadge && (
        <Badge
          variant="secondary"
          className={cn(
            'ml-auto',
            provider.stage === 'ga' && 'bg-green-200',
            provider.stage === 'beta' && 'bg-blue-200',
            provider.stage === 'alpha' && 'bg-pink-50',
          )}>
          {provider.stage}
        </Badge>
      )}
    </div>
    <ProviderLogo
      {...uiProps}
      provider={provider}
      // min-h-0 is a hack where some images do not shrink in height @see https://share.cleanshot.com/jMX1bzLP
      className="min-h-0 grow"
    />
    {children}
  </Card>
)

export const ProviderLogo = ({
  provider,
  className,
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  Image = (props) => <img {...props} />,
}: UIPropsNoChildren & {
  provider: ProviderMeta
}) =>
  provider.logoUrl ? (
    <Image
      width={100}
      height={100}
      src={provider.logoUrl}
      alt={`"${provider.displayName}" logo`}
      className={cn('object-contain', className)}
    />
  ) : (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <span>{provider.displayName}</span>
    </div>
  )

export function InstitutionLogo({
  institution,
  className,
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  Image = (props) => <img {...props} />,
}: UIPropsNoChildren & {
  institution?: ZStandard['institution'] | null | undefined
}) {
  return institution?.logoUrl ? (
    <Image
      src={institution.logoUrl}
      alt={`"${institution.name}" logo`}
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
