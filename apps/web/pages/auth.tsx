import {Auth, ThemeSupa} from '@supabase/auth-ui-react'
import {Container} from '@usevenice/ui'
import Image from 'next/image'

import {PageContainer} from '../components/common-components'
import {supabase} from '../contexts/common-contexts'

export default function AuthScreen() {
  return (
    <PageContainer authenticated={false}>
      <Container className="mt-20 flex-1">
        <div className="mx-auto grid w-80 grid-cols-1 ">
          <Image
            src="/venice-logo.svg"
            alt="Venice Logo"
            width={102}
            height={32}
          />
          <p className="mt-6 text-center text-green">
            Youll be up and running in 2 minutes!
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
    </PageContainer>
  )
}

const veniceThemeTweaks = {
  default: {
    colors: {
      brand: '#12B886',
      brandAccent: '#12B886',
      brandButtonText: 'white',
      defaultButtonBackground: '#2e2e2e',
      defaultButtonBackgroundHover: '#3e3e3e',
    },
  },
}
