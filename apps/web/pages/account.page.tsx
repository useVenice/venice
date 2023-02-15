import {PageHeader} from '../components/PageHeader'
import {browserSupabase} from '../contexts/common-contexts'
import {useSession} from '../contexts/session-context'
import {PageLayout} from '../components/PageLayout'

export default function AccountPage() {
  const [session] = useSession()
  return (
    <PageLayout title="Account">
      <PageHeader title={['Account']} />
      <div className="mx-auto mt-12 flex max-w-md flex-col gap-y-8 p-4">
        <p>Logged in as {session?.user?.email}</p>
        <button
          className="btn btn-primary"
          onClick={() => browserSupabase.auth.signOut()}>
          Log out
        </button>
      </div>
    </PageLayout>
  )
}
