import {Auth, ThemeSupa} from '@supabase/auth-ui-react'
import {useMutation} from '@tanstack/react-query'
import {xAdminAppMetadataKey} from '@usevenice/engine-backend/safeForFrontend'
import {
  Button,
  CircularProgress,
  Container,
  FrownIcon,
  Input,
  Label,
} from '@usevenice/ui'
import Image from 'next/image'

import {PageLayout} from '../../components/PageLayout'
import {RedirectTo} from '../../components/RedirectTo'
import {useSession, useSupabase} from '../../contexts/session-context'
import {VeniceTheme} from '../../themes'

export default function AdminAuthScreen() {
  const [session] = useSession()
  const supabase = useSupabase()

  const isAdmin = session?.user.app_metadata[xAdminAppMetadataKey] === true

  const logout = useMutation<void, Error>(async () => {
    await supabase.auth.signOut()
  })
  const refreshSession = useMutation<void, Error>(async () => {
    await supabase.auth.refreshSession()
  })

  if (session && isAdmin) {
    return <RedirectTo url="/admin" />
  }
  if (session && !isAdmin) {
    return (
      <PageLayout title="Admin only" auth="none">
        <Container className="min-h-screen justify-center">
          <p>
            This portal is only accessible to admins. Please contact an existing
            admin to grant you permission. If you were recently granted admin
            access, press refresh session.
          </p>
          <div className="grid w-full max-w-[20rem] gap-3">
            <Label>You are logged in as</Label>
            <Input value={session?.user.email ?? session.user.id} readOnly />
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
      </PageLayout>
    )
  }

  return (
    <PageLayout title="Login" auth="none">
      <Container className="min-h-screen justify-center">
        <div className="mx-auto grid w-80 grid-cols-1">
          <Image
            className="mx-auto"
            src="/venice-logo-white-no-bg.svg"
            alt="Venice Logo"
            width={102}
            height={32}
          />
          <p className="mt-6 text-center text-green">
            You&apos;ll be up and running in 2 minutes!
          </p>
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: veniceThemeTweaks,
            }}
            localization={{
              variables: {
                // Workaround for not implementing password reset just yet...
                forgotten_password: {
                  button_label: 'Email me a magic link to sign in with',
                  link_text: 'Email me a magic link to sign in with',
                },
                sign_in: {
                  link_text: 'Sign in to an existing account',
                },
              },
            }}
            providers={['google', 'github']}
            theme="dark"></Auth>
        </div>
      </Container>
    </PageLayout>
  )
}

const veniceThemeTweaks = {
  default: {
    colors: {
      brand: VeniceTheme._green,
      brandAccent: VeniceTheme._green,
      brandButtonText: VeniceTheme.offwhite,
      defaultButtonBackground: '#2e2e2e',
      defaultButtonBackgroundHover: '#3e3e3e',
    },
  },
}
