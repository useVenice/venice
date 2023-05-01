'use client'

import Image from 'next/image'

import {PROVIDERS} from '@usevenice/app-config/env'
import type {AnySyncProvider} from '@usevenice/cdk-core'
import {trpcReact} from '@usevenice/engine-frontend'
import {Button, Card} from '@usevenice/ui/new-components'
import {titleCase, urlFromImage} from '@usevenice/util'

const providers = PROVIDERS.map((provider: AnySyncProvider) => ({
  ...provider,
  displayName: provider.metadata?.displayName ?? titleCase(provider.name),
  logoUrl: provider.metadata?.logoSvg
    ? urlFromImage({type: 'svg', data: provider.metadata?.logoSvg})
    : provider.metadata?.logoUrl,
}))

const ProviderCard = ({
  provider,
  actionText,
}: {
  provider: (typeof providers)[number]
  actionText: string
}) => (
  <Card
    key={provider.name}
    className="m-3 flex h-40 w-40 flex-col items-center p-2">
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
    <Button className="mt-2" variant="default">
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
            const provider = providers.find((p) => p.name === int.providerName)
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
      <div className="flex flex-wrap">
        {providers.map((provider) => (
          <ProviderCard
            key={provider.name}
            provider={provider}
            actionText="Add"
          />
        ))}
      </div>
    </div>
  )
}
