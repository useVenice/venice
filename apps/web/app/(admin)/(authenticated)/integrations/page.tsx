'use client'

import Image from 'next/image'

import {PROVIDERS} from '@usevenice/app-config/env'
import type {AnySyncProvider} from '@usevenice/cdk-core'
import {zIntegrationCategory, zIntegrationStage} from '@usevenice/cdk-core'
import {trpcReact} from '@usevenice/engine-frontend'
import {Badge, Button, Card} from '@usevenice/ui/new-components'
import {sort, titleCase, urlFromImage} from '@usevenice/util'

import {cn} from '@/lib/utils'

const allProviders = sort(
  PROVIDERS.map((provider: AnySyncProvider) => ({
    // ...provider,
    name: provider.name,
    displayName: provider.metadata?.displayName ?? titleCase(provider.name),
    logoUrl: provider.metadata?.logoSvg
      ? urlFromImage({type: 'svg', data: provider.metadata?.logoSvg})
      : provider.metadata?.logoUrl,
    stage: provider.metadata?.stage ?? 'alpha',
    platforms: provider.metadata?.platforms ?? ['cloud', 'local'],
    categories: provider.metadata?.categories ?? ['other'],
  })),
).desc((p) => zIntegrationStage.options.indexOf(p.stage))

const availableProviders = allProviders.filter((p) => p.stage !== 'hidden')

const ProviderCard = ({
  provider,
  actionText,
  onAction,
}: {
  provider: (typeof allProviders)[number]
  actionText: string
  onAction?: () => void
}) => (
  <Card
    key={provider.name}
    className="m-3 flex h-48 w-48 flex-col items-center p-2">
    <div className="flex self-stretch">
      <Badge
        variant="secondary"
        className={cn(
          'ml-auto',
          provider.stage === 'production' && 'bg-green-200',
          provider.stage === 'beta' && 'bg-blue-200',
          provider.stage === 'alpha' && 'bg-pink-50',
        )}>
        {provider.stage}
      </Badge>
    </div>
    {provider.logoUrl ? (
      <Image
        width={100}
        height={100}
        src={provider.logoUrl}
        alt={provider.displayName}
        className="grow object-contain"
      />
    ) : (
      <div className="flex grow flex-col items-center justify-center">
        <caption>{provider.displayName}</caption>
      </div>
    )}
    <Button className="mt-2" variant="default" onClick={onAction}>
      {actionText}
    </Button>
  </Card>
)

export default function IntegrationsPage() {
  const integrationsRes = trpcReact.adminListIntegrations.useQuery()

  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-semibold tracking-tight">
        Configured integrations
      </h2>

      {integrationsRes.data ? (
        <div className="flex flex-wrap">
          {integrationsRes.data.map((int) => {
            const provider = allProviders.find(
              (p) => p.name === int.providerName,
            )
            return (
              <ProviderCard
                key={int.id}
                provider={provider!}
                actionText="Edit"
              />
            )
          })}
        </div>
      ) : (
        <div>No integrations configured</div>
      )}
      {/* Spacer */}
      <div className="mt-4" />
      <h2 className="mb-4 text-2xl font-semibold tracking-tight">
        Available integrations
      </h2>
      {zIntegrationCategory.options.map((category) => {
        const providers = availableProviders.filter((p) =>
          p.categories.includes(category),
        )
        if (!providers.length) {
          return null
        }
        return (
          <div key={category}>
            <h3 className="mb-4 ml-4 text-xl font-semibold tracking-tight">
              {titleCase(category)}
            </h3>
            <div className="flex flex-wrap">
              {providers.map((provider) => (
                <ProviderCard
                  key={`${category}-${provider.name}`}
                  provider={provider}
                  actionText={
                    provider.stage === 'alpha' ? 'Request access' : 'Add'
                  }
                  onAction={() => {
                    if (provider.stage === 'alpha') {
                      window.open(
                        `mailto:hi@venice.is?subject=Request%20access%20to%20${provider.displayName}%20integration&body=My%20use%20case%20is...`,
                      )
                    } else {
                      // open modal...
                    }
                  }}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
