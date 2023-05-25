import {getOrCreateApikey} from '@/lib-server'
import {serverComponentGetViewer} from '@/lib-server/server-component-helpers'

export default async function ApiKeyPage() {
  const viewer = await serverComponentGetViewer()
  const apikey = await getOrCreateApikey(viewer)

  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-semibold tracking-tight">API Keys</h2>
      {/* TODO: Need component to display information */}
      <pre>{apikey}</pre>
    </div>
  )
}
