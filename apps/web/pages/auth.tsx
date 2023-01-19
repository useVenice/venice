import {Auth, ThemeSupa} from '@supabase/auth-ui-react'
import {Container} from '@usevenice/ui'
import Image from 'next/image'

import {PageContainer} from '../components/common-components'
import {supabase} from '../contexts/common-contexts'

export default function AuthScreen() {
  return (
    <PageContainer authenticated={false}>
      <Container className="flex-1">
        <div className="mx-auto grid w-80 grid-cols-1 ">
          <Image
            src="/venice-logo.svg"
            alt="Venice Logo"
            width={102}
            height={32}
          />
          <p className="mt-6 text-center">
            Youll be up and running in 2 minutes!
          </p>
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#12B886',
                    brandAccent: '#12B886',
                  },
                },
              },
            }}
            providers={['google', 'github']}></Auth>
        </div>
      </Container>
    </PageContainer>
  )
}
