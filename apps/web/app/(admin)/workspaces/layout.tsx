import {cookies} from 'next/headers'
import {SuperHydrate} from '../../../components/SuperHydrate'
import {createSSRHelpers} from '../../../server'

export default async function WorkspacesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const helpers = await createSSRHelpers({cookies})
  await Promise.all([
    //
    helpers.ssg.adminListWorkspaces.fetch({}),
  ])

  return (
    <div className="flex h-screen w-screen flex-col">
      <SuperHydrate dehydratedState={helpers.getDehyratedState()}>
        {children}
      </SuperHydrate>
    </div>
  )
}
