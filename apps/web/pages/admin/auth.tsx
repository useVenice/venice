import {Auth, ThemeSupa} from '@supabase/auth-ui-react'
import {useMutation} from '@tanstack/react-query'
import {xAdminUserMetadataKey} from '@usevenice/engine-backend/safeForFrontend'
import {
  Button,
  CircularProgress,
  Container,
  FrownIcon,
  Input,
  Label,
} from '@usevenice/ui'
import Image from 'next/image'

import {AdminPageLayout} from '../../components/PageLayout'
import {RedirectTo} from '../../components/RedirectTo'
import {useSession, useSupabase} from '../../contexts/session-context'
import {VeniceTheme} from '../../themes'

export default function AdminAuthScreen() {
  const [session] = useSession()
  const supabase = useSupabase()

  const isAdmin = session?.user.user_metadata[xAdminUserMetadataKey] === true

  const logout = useMutation<void, Error>(async () => {
    await supabase.auth.signOut()
  })

  if (session && isAdmin) {
    return <RedirectTo url="/admin" />
  }
  if (session && !isAdmin) {
    return (
      <AdminPageLayout title="Admin only" requiresAuthentication={false}>
        <Container className="min-h-screen justify-center">
          <p>
            This portal is only accessible to admins. Please contact an existing
            admin to grant you permission.
          </p>
          <form
            className="flex flex-col items-start gap-6"
            onSubmit={(event) => {
              event.preventDefault()
              logout.mutate()
            }}>
            <div className="grid w-full max-w-[20rem] gap-3">
              <Label>You are logged in as</Label>
              <Input value={session?.user.email ?? session.user.id} readOnly />
            </div>
            <Button
              variant="primary"
              className="gap-2"
              disabled={logout.isLoading}>
              {logout.isLoading ? (
                <CircularProgress className="h-4 w-4 fill-offwhite text-offwhite/50" />
              ) : (
                <FrownIcon className="h-4 w-4 fill-current" />
              )}
              Log out
            </Button>
          </form>
        </Container>
      </AdminPageLayout>
    )
  }

  return (
    <AdminPageLayout title="Login" requiresAuthentication={false}>
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
    </AdminPageLayout>
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
