import type {ZRaw} from '@usevenice/cdk-core'
import React from 'react'

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
