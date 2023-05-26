import Link from 'next/link'

import {Input, Label} from '@usevenice/ui/shadcn'

import {cn} from '@/lib-client/ui-utils'
import {getOrCreateApikey} from '@/lib-server'
import {serverComponentGetViewer} from '@/lib-server/server-component-helpers'

export default async function ApiKeyPage() {
  const viewer = await serverComponentGetViewer()
  const apikey = await getOrCreateApikey(viewer)

  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-semibold tracking-tight">API</h2>
      {/* TODO: Need component to display information */}

      <div className="flex gap-4">
        <Link
          href="/api-access/graphql"
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
          )}>
          GraphQL Explorer
        </Link>
        <Link
          href="/api-access/rest"
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
          )}>
          Rest Explorer
        </Link>
      </div>
      <div className="mt-4 flex items-center">
        <Label className="mr-4 shrink-0" htmlFor="apikey">
          API Key
        </Label>
        <Input className="font-mono" readOnly value={apikey} />
      </div>
      <p className="mt-4">More docs coming soon</p>
    </div>
  )
}
