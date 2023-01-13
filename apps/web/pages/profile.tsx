import {Container} from '@usevenice/ui'

import {PageContainer} from '../components/common-components'
import {supabase} from '../contexts/common-contexts'
import {useSession} from '../contexts/session-context'

export default function ProfileScreen() {
  const [session] = useSession()

  return (
    <PageContainer authenticated>
      <Container className="flex-1">
        <span className="text-xs">
          You are logged in as {session?.user?.email}
        </span>
        <button
          className="btn-outline btn"
          onClick={() => supabase.auth.signOut()}>
          Log out
        </button>
      </Container>
    </PageContainer>
  )
}
