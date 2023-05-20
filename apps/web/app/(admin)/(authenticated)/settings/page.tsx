'use client'

import {trpcReact} from '@/../../packages/engine-frontend'
import {SchemaForm} from '@/../../packages/ui'
import {z} from '@/../../packages/util'

export default function SettingsPage() {
  const resourcesRes = trpcReact.listResources.useQuery()

  const zResoId = z.union(
    (resourcesRes.data ?? []).map((r) =>
      z
        .literal(r.id)
        .describe(r.displayName ? `${r.displayName} <${r.id}>` : r.id),
    ) as [z.ZodLiteral<string>, z.ZodLiteral<string>],
  )

  const formSchema = z.object({
    defaultDestinationId: zResoId
      .optional()
      .describe('Create a pipeline to this destination whenever a new source is created'),
  })

  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-semibold tracking-tight">Settings</h2>
      <SchemaForm schema={formSchema} />
    </div>
  )
}
