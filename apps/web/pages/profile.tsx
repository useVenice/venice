import {Auth} from '@supabase/auth-ui-react'

import {Container} from '@usevenice/ui'

import {PageContainer} from '../components/common-components'
import {supabase} from '../contexts/common-contexts'

export default function ProfileScreen() {
  const {user} = Auth.useUser()

  return (
    <PageContainer authenticated>
      <Container className="flex-1">
        <span className="text-xs">You are logged in as {user?.email}</span>
        <button
          className="btn-outline btn"
          onClick={() => supabase.auth.signOut()}>
          Log out
        </button>
      </Container>
    </PageContainer>
  )
}
