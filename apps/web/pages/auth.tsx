import {Auth, ThemeSupa} from '@supabase/auth-ui-react'
import {Container} from '@usevenice/ui'
import Image from 'next/image'

import {RedirectTo} from '@usevenice/web/components/common-components'
import {supabase} from '@usevenice/web/contexts/common-contexts'
import {useSession} from '@usevenice/web/contexts/session-context'
import {PageLayout} from '@usevenice/web/layouts/PageLayout'
import {VeniceTheme} from '@usevenice/web/styles/themes'

export default function AuthScreen() {
  const [session] = useSession()

  if (session) {
    return <RedirectTo url="/pipelines" />
  }

  return (
    <PageLayout title="Login" requiresAuthentication={false}>
      <Container className="min-h-screen justify-center">
        <div className="mx-auto grid w-80 grid-cols-1">
          <Image
            src="/venice-logo.svg"
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
      brand: VeniceTheme.green,
      brandAccent: VeniceTheme.green,
      brandButtonText: VeniceTheme.offwhite,
      defaultButtonBackground: '#2e2e2e',
      defaultButtonBackgroundHover: '#3e3e3e',
    },
  },
}
