import {cookies} from 'next/headers'
import {SuperHydrate} from '../../../components/SuperHydrate'
import {createSSRHelpers} from '../../../server'
import {Workspaces} from './Workspaces'

export default async function WorkspaceList() {
  const helpers = await createSSRHelpers({cookies})
  await Promise.all([
    //
    helpers.ssg.adminListWorkspaces.fetch({}),
  ])

  return (
    <div className="flex h-screen w-screen flex-col">
      <SuperHydrate dehydratedState={helpers.getDehyratedState()}>
        <Workspaces />
      </SuperHydrate>
    </div>
  )
}
