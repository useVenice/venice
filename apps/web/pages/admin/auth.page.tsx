import {Auth, ThemeSupa} from '@supabase/auth-ui-react'
import {Container} from '@usevenice/ui'
import Image from 'next/image'

import {RedirectTo} from '../../components/RedirectTo'
import {browserSupabase} from '../../contexts/common-contexts'
import {useSession} from '../../contexts/session-context'
import {PageLayout} from '../../components/PageLayout'
import {VeniceTheme} from '../../themes'

export default function AuthScreen() {
  const [session] = useSession()

  if (session) {
    return <RedirectTo url="/admin/connections" />
  }

  return (
    <PageLayout title="Login" requiresAuthentication={false}>
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
            supabaseClient={browserSupabase}
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
