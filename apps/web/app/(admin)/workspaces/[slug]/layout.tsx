'use client'

import {trpcReact} from '@usevenice/engine-frontend'
import {RedirectToNext13} from '../../../../components/RedirectTo'
import {WorkspaceContext} from '../../../../contexts/workspace-context'

export default function WorkspaceLayout({
  children,
  params: {slug},
}: {
  children: React.ReactNode
  params: {slug: string}
}) {
  const workspacesRes = trpcReact.adminListWorkspaces.useQuery({})
  console.log('/workspaces/[slug] rendering', {slug}, workspacesRes.data)
  if (!workspacesRes.data) {
    // Should not happen due to parent layout server fetching
    return null
  }
  const workspace = workspacesRes.data.find((w) => w.slug === slug)
  if (!workspace) {
    return (
      <RedirectToNext13 url="/workspaces">
        <div>Workspace {slug} not found</div>
      </RedirectToNext13>
    )
  }

  return (
    <WorkspaceContext.Provider value={{workspace}}>
      {children}
    </WorkspaceContext.Provider>
  )
}
