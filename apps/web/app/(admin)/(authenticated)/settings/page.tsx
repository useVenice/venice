'use client'

import {useOrganization} from '@clerk/nextjs'

import {LoadingText, SchemaForm, useWithToast} from '@usevenice/ui'
import {z} from '@usevenice/util'

import {trpcReact} from '@/lib-client/trpcReact'
import {zOrgMetadata} from '@/lib-common/schemas'

/** Move this somewhere where other components can access */

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
    return <LoadingText className="block p-4" />
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
