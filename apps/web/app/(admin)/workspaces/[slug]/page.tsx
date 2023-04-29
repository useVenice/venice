'use client'

import {useWorkspaceContext} from '../../../../contexts/workspace-context'

export default function WorkspaceHome() {
  const {workspace} = useWorkspaceContext()

  return (
    <div className="flex h-screen w-screen flex-col">
      <h1>
        Hello {workspace.name} {workspace.id}
      </h1>
    </div>
  )
}
