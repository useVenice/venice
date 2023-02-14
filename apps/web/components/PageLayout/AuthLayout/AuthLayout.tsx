import type {PropsWithChildren} from 'react'

import {RedirectTo} from '../../common-components'
import {LoadingIndicatorOverlay} from '../../loading-indicators'
import {useSession} from '../../../contexts/session-context'
import {Sidebar} from './Sidebar'

interface AuthLayoutProps extends PropsWithChildren {}

export function AuthLayout({children}: AuthLayoutProps) {
  const [session, {status}] = useSession()
  const isLoadingSession = status === 'loading'

  if (isLoadingSession) {
    return <LoadingIndicatorOverlay />
  }

  if (!isLoadingSession && !session) {
    return <RedirectTo url="/auth" />
  }

  return (
    <div className="h-screen bg-venice-black">
      <div className="fixed inset-y-0 flex w-56 flex-col">
        <Sidebar />
      </div>
      <div className="flex flex-1 flex-col overflow-x-hidden pl-56">
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
