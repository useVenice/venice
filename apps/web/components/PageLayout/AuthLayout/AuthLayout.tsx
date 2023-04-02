import type {PropsWithChildren} from 'react'

import {RedirectTo} from '../../RedirectTo'
import {LoadingIndicatorOverlay} from '../../loading-indicators'
import {useSession} from '../../../contexts/session-context'
import {Sidebar} from './Sidebar'
import {xAdminUserMetadataKey} from '@usevenice/engine-backend/safeForFrontend'

interface AuthLayoutProps extends PropsWithChildren {
  adminOnly?: boolean
}

export function AuthLayout({adminOnly, children}: AuthLayoutProps) {
  const [session, {status}] = useSession()
  const isLoadingSession = status === 'loading'
  const isAdmin = session?.user.user_metadata[xAdminUserMetadataKey] === true

  if (isLoadingSession) {
    return <LoadingIndicatorOverlay />
  }

  if ((!isLoadingSession && !session) || (adminOnly && !isAdmin)) {
    return <RedirectTo url="/admin/auth" />
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
