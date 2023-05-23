'use client'

import {useOrganization} from '@clerk/nextjs'

import type {TRPCReact} from '@usevenice/engine-frontend'
import {trpcReact as _trpcReact} from '@usevenice/engine-frontend'
import {LoadingText, SchemaForm, useWithToast} from '@usevenice/ui'
import {z} from '@usevenice/util'

import {zOrgMetadata} from '@/lib/schemas'
import type {AppRouter} from '@/pages/api/trpc/[...trpc]'

/** Move this somewhere where other components can access */
const trpcReact = _trpcReact as unknown as TRPCReact<AppRouter>

export default function SettingsPage() {
  const {onSuccess, onError} = useWithToast()

  const org = useOrganization()
  const updateOrg = trpcReact.updateOrganization.useMutation({
    onSuccess,
    onError,
  })
  const resourcesRes = trpcReact.listResources.useQuery()
  const integrationsRes = trpcReact.listIntegrationInfos.useQuery({})

  const zResoId = z.union(
    (resourcesRes.data ?? []).map((r) =>
      z
        .literal(r.id)
        .describe(r.displayName ? `${r.displayName} <${r.id}>` : r.id),
    ) as [z.ZodLiteral<string>, z.ZodLiteral<string>],
  )
  const zIntId = z.union(
    (integrationsRes.data ?? []).map((i) =>
      z
        .literal(i.id)
        .describe(i.providerName ? `${i.providerName} <${i.id}>` : i.id),
    ) as [z.ZodLiteral<string>, z.ZodLiteral<string>],
  )

  const formSchema = zOrgMetadata({
    srcResoId: zResoId,
    destResoId: zResoId,
    destIntId: zIntId,
    srcIntId: zIntId,
  })

  // console.log('org public meta', org.organization?.publicMetadata)

  if (
    !org.organization ||
    resourcesRes.isLoading ||
    integrationsRes.isLoading
  ) {
    return <LoadingText />
  }

  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-semibold tracking-tight">Settings</h2>
      <SchemaForm
        schema={formSchema}
        formData={org.organization?.publicMetadata ?? {}}
        onSubmit={({formData}) => {
          if (!org.organization?.id) {
            return
          }
          updateOrg.mutate({
            id: org.organization.id,
            publicMetadata: formData,
          })
        }}
      />
    </div>
  )
}
