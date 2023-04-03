import type {PropsWithChildren} from 'react'

import {RedirectTo} from '../../RedirectTo'
import {LoadingIndicatorOverlay} from '../../loading-indicators'
import {useSession, useSupabase} from '../../../contexts/session-context'
import {Sidebar} from './Sidebar'
import {xAdminAppMetadataKey} from '@usevenice/engine-backend/safeForFrontend'
import {
  Button,
  CircularProgress,
  Container,
  FrownIcon,
  Input,
  Label,
} from '@usevenice/ui'
import {useMutation} from '@tanstack/react-query'

interface AuthLayoutProps extends PropsWithChildren {
  adminOnly?: boolean
}

export function AuthLayout({adminOnly, children}: AuthLayoutProps) {
  const [session, {status}] = useSession()
  const supabase = useSupabase()

  const logout = useMutation<void, Error>(async () => {
    await supabase.auth.signOut()
  })
  const refreshSession = useMutation<void, Error>(async () => {
    await supabase.auth.refreshSession()
  })
  const isLoadingSession = status === 'loading'
  const isAdmin = session?.user.app_metadata[xAdminAppMetadataKey] === true

  if (isLoadingSession) {
    return <LoadingIndicatorOverlay />
  }

  if (!isLoadingSession && !session) {
    return <RedirectTo url="/admin/auth" />
  }

  if (adminOnly && !isAdmin) {
    return (
      <Container className="min-h-screen justify-center">
        <p>
          This page is only accessible to admins. Please contact an existing
          admin to grant you permission. If you were recently granted admin
          access, press refresh session.
        </p>
        <div className="grid w-full max-w-[20rem] gap-3">
          <Label>You are logged in as</Label>
          <Input value={session?.user.email ?? session?.user.id} readOnly />
        </div>
        <div className="mt-4 flex flex-row gap-4 align-middle">
          <Button
            variant="primary"
            className="gap-2"
            onClick={() => refreshSession.mutate()}
            disabled={refreshSession.isLoading}>
            {refreshSession.isLoading && (
              <CircularProgress className="h-4 w-4 fill-offwhite text-offwhite/50" />
            )}
            Refresh session
          </Button>
          <Button
            variant="default"
            className="gap-2"
            onClick={() => logout.mutate()}
            disabled={logout.isLoading}>
            {logout.isLoading ? (
              <CircularProgress className="h-4 w-4 fill-offwhite text-offwhite/50" />
            ) : (
              <FrownIcon className="h-4 w-4 fill-current" />
            )}
            Log out
          </Button>
        </div>
      </Container>
    )
  }

  return (
    <div className="h-screen bg-venice-black">
      <div className="fixed inset-y-0 flex w-56 flex-col">
        <Sidebar />
      </div>
      <div className="flex h-screen flex-1 flex-col overflow-x-hidden pl-56">
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
    </div>
  )
}
