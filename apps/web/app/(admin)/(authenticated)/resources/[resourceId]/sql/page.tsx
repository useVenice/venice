import type {Id} from '@usevenice/cdk-core'

import {contextFactory} from '@/../app-config/backendConfig'
import {serverComponentGetViewer} from '@/server/server-component-helpers'

export default async function SqlPage({
  params: {resourceId},
}: {
  params: {resourceId: Id['reso']}
}) {
  const viewer = await serverComponentGetViewer()
  const ctx = contextFactory.fromViewer(viewer)

  const resource = await ctx.helpers.getResourceOrFail(resourceId)
  if (resource.providerName !== 'postgres') {
    return (
      <div className="p-6">Only postgres resources are supported for sql</div>
    )
  }

  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-semibold tracking-tight">
        SQL for resource {resource.id}
      </h2>
    </div>
  )
}
