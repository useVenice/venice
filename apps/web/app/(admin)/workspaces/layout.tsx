import {SuperHydrate} from '@/components/SuperHydrate'
import {createServerComponentHelpers} from '@/server'

export default async function WorkspacesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const helpers = await createServerComponentHelpers()
  await Promise.all([helpers.ssg.adminListWorkspaces.fetch({})])

  return (
    <div className="flex h-screen w-screen flex-col">
      <SuperHydrate dehydratedState={helpers.getDehyratedState()}>
        {children}
      </SuperHydrate>
    </div>
  )
}
