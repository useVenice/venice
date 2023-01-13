import {Auth} from '@supabase/auth-ui-react'

import {Container} from '@usevenice/ui'

import {PageContainer} from '../components/common-components'
import {supabase} from '../contexts/common-contexts'

export default function AuthScreen() {
  return (
    <PageContainer authenticated={false}>
      <Container className="flex-1">
        <Auth
          supabaseClient={supabase}
          providers={['apple', 'google', 'facebook', 'github']}></Auth>
      </Container>
    </PageContainer>
  )
}
