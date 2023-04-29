import type {Viewer} from '@usevenice/cdk-core'
import React from 'react'

/** TODO This ought to be a bit more generic... */
export type AsyncStatus = 'initial' | 'loading' | 'error' | 'success'

// Maybe we can just be anonymous and initial by default?
// But it would be a bit annoying that we are not able to distinguish missing
// provider scenario
export const ViewerContext = React.createContext<
  | {
      viewer: Viewer
      status: AsyncStatus
      error?: unknown
      accessToken?: string | null
    }
  | undefined
>(undefined)

export function useViewerContext() {
  const context = React.useContext(ViewerContext)
  if (context === undefined) {
    throw new Error(
      'useViewerContext must be used within a ViewerContext.Provder',
    )
  }
  return context
}
