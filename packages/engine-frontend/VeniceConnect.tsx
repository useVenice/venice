import {useMutation} from '@tanstack/react-query'
import React from 'react'

import type {
  AnyProviderDef,
  EndUserId,
  Id,
  OpenDialogFn,
  ProviderMeta,
  UseConnectHook,
} from '@usevenice/cdk-core'
import {extractProviderName, zIntegrationCategory} from '@usevenice/cdk-core'
import {ProviderCard} from '@usevenice/ui/domain-components'
import {Button} from '@usevenice/ui/new-components'
import {R, titleCase} from '@usevenice/util'

import {trpcReact} from './TRPCProvider'

export interface VeniceConnectProps {
  endUserId?: EndUserId | null
  integrationIds: Array<Id['int']>
  providerMetaByName: Record<string, ProviderMeta>
}

type UseConnectScope = Parameters<UseConnectHook<AnyProviderDef>>[0]
interface DialogConfig {
  Component: Parameters<UseConnectScope['openDialog']>[0]
  options: Parameters<UseConnectScope['openDialog']>[1]
}

// TODO: Wrap this in memo so it does not re-render as much as possible.
export function VeniceConnect({
  endUserId,
  integrationIds,
  providerMetaByName,
}: VeniceConnectProps) {
  const [dialogConfig, setDialogConfig] = React.useState<DialogConfig | null>(
    null,
  )
  const openDialog: OpenDialogFn = React.useCallback(
    (render, options) => {
      setDialogConfig({Component: render, options})
    },
    [setDialogConfig],
  )
  const integrations = integrationIds
    .map((id) => {
      const provider = providerMetaByName[extractProviderName(id)]
      return provider ? {id, provider} : null
    })
    .filter((i): i is NonNullable<typeof i> => !!i)

  const connectFnMap = R.pipe(
    integrationIds,
    R.map(extractProviderName),
    R.uniq,
    R.mapToObj((name: string) => [
      name,
      providerMetaByName[name]?.useConnectHook?.({endUserId, openDialog}),
    ]),
  )

  const categories = zIntegrationCategory.options
    .map((category) => ({
      key: category,
      name: titleCase(category),
      integrations: integrations.filter((integration) =>
        integration.provider?.categories.includes(category),
      ),
    }))
    .filter((item) => item.integrations.length > 0)

  const {client} = trpcReact.useContext()
  // TODO: we cannot use preConnect here becase it is a query...
  // Will need to render each of those as separate react components instead so we can properly
  // preConnect

  const postConnect = trpcReact.postConnect.useMutation()

  const connect = useMutation(async (intId: Id['int']) => {})

  return (
    <div className="flex flex-wrap">
      {false &&
        categories.map((category) => (
          <div key={category.key}>
            <h3 className="mb-4 ml-4 text-xl font-semibold tracking-tight">
              {category.name}
            </h3>
            {category.integrations.map((int) => (
              <div key={int.id}>Connect with {int.id}</div>
            ))}
          </div>
        ))}

      {integrations.map((int) => (
        <ProviderCard key={int.id} provider={int.provider}>
          <Button
            className="mt-2"
            variant="ghost"
            onClick={() => {
              // do something
            }}>
            Connect
          </Button>
        </ProviderCard>
      ))}
    </div>
  )
}
