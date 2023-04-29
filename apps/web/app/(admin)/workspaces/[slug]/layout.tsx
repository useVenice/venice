import {notFound} from 'next/navigation'
import {WorkspaceContextProvider} from '../../../../contexts/workspace-context'
import {createServerComponentHelpers} from '../../../../server'

export default async function WorkspaceLayout({
  children,
  params: {slug},
}: {
  children: React.ReactNode
  params: {slug: string}
}) {
  const {ssg} = await createServerComponentHelpers()
  const workspaces = await ssg.adminListWorkspaces.fetch({})
  const workspace = workspaces.find((w) => w.slug === slug)
  if (!workspace) {
    notFound()
  }

  return (
    <WorkspaceContextProvider value={{workspace}}>
      {children}
    </WorkspaceContextProvider>
  )
}
