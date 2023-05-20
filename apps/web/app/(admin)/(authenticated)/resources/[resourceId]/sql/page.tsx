import type {Id} from '@usevenice/cdk-core'

import {contextFactory} from '@/../app-config/backendConfig'
import {serverComponentGetViewer} from '@/server/server-component-helpers'

import {SqlPage} from './SqlPage'

export default async function SqlPageServer({
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

  return <SqlPage resourceId={resourceId} />
}
