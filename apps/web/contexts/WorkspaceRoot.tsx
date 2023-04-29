'use client'

import React from 'react'

import type {ZRaw} from '@usevenice/cdk-core'
import {trpcReact} from '@usevenice/engine-frontend'

import {RedirectToNext13} from '@/components/RedirectTo'

/**
 * Workaround for not being able to render Context directly in server components
 * @see https://share.cleanshot.com/PLcD2gwJ
 * Though perhaps we can turn this into WorkspaceRoot component?
 */
export function WorkspaceRoot(props: {
  children: React.ReactNode
  slug: string
  // value: NonNullable<React.ContextType<typeof WorkspaceContext>>
}) {
  // This is really tricky...
  // When slug changes we will not be updating url for the page automatically for instance
  // Which means that URL will be out of date relative to Workspace context...
  const res = trpcReact.adminListWorkspaces.useQuery({})
  console.log('workspace', res.data)
  const workspace = res.data?.find((w) => w.slug === props.slug)

  if (!workspace) {
    return (
      <RedirectToNext13 url="/workspaces">
        <div>Workspace {props.slug} not found, redirecting to home</div>
      </RedirectToNext13>
    )
  }

  return (
    <WorkspaceContext.Provider value={{workspace}}>
      {props.children}
    </WorkspaceContext.Provider>
  )
}

// Maybe we can just be anonymous and initial by default?
// But it would be a bit annoying that we are not able to distinguish missing
// provider scenario
export const WorkspaceContext = React.createContext<
  {workspace: ZRaw['workspace']} | undefined
>(undefined)

export function useWorkspaceContext() {
  const context = React.useContext(WorkspaceContext)
  if (context === undefined) {
    throw new Error(
      'useWorkspaceContext must be used within a WorkspaceContext.Provder',
    )
  }
  return context
}
