import type {PropsWithChildren} from 'react'

import {RedirectTo} from '../../../components/common-components'
import {LoadingIndicatorOverlay} from '../../../components/loading-indicators'
import {useSession} from '../../../contexts/session-context'
import {Sidebar} from './Sidebar'

interface AuthLayoutProps extends PropsWithChildren {}

export function AuthLayout({children}: AuthLayoutProps) {
  const [session, {loading: isLoadingSession}] = useSession()

  if (isLoadingSession) {
    return <LoadingIndicatorOverlay />
  }

  if (!isLoadingSession && !session) {
    return <RedirectTo url="/auth" />
  }

  return (
    <div className="h-screen bg-venice-black">
      <div className="fixed inset-y-0 flex w-64 flex-col">
        <Sidebar />
      </div>
      <div className="flex flex-1 flex-col pl-64">
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
