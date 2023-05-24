import Link from 'next/link'

import {cn} from '@/lib-client/ui-utils'

export default function DocsPage() {
  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-semibold tracking-tight">Docs</h2>
      <div className="flex gap-4">
        <Link
          href="/docs/graphql"
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
          )}>
          GraphQL Explorer
        </Link>
        <Link
          href="/docs/rest"
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
          )}>
          Rest Explorer
        </Link>
      </div>
      <p className="mt-4">More coming soon</p>
    </div>
  )
}
