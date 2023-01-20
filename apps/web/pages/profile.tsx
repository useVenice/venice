import {Container} from '@usevenice/ui'

import {PageContainer} from '../components/common-components'
import {supabase} from '../contexts/common-contexts'
import {useSession} from '../contexts/session-context'

export default function ProfileScreen() {
  const [session] = useSession()

  return (
    <PageContainer title="Profile">
      <Container className="flex-1">
        <div className="mx-auto mt-5 grid max-w-md grid-cols-1 p-4">
          <span className="text-sm">Logged in as {session?.user?.email}</span>
          <button
            className="btn btn-primary mt-10"
            onClick={() => supabase.auth.signOut()}>
            Log out
          </button>
        </div>
      </Container>
    </PageContainer>
  )
}
