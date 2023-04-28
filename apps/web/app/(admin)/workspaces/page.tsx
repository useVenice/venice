import {ClientRoot} from '../ClientRoot'
import {Workspaces} from './Workspaces'

export default function WorkspaceList() {
  return (
    <div className="flex h-screen w-screen flex-col">
      <ClientRoot>
        <Workspaces />
      </ClientRoot>
    </div>
  )
}
