import type {GetServerSideProps} from 'next'
import {PageHeader} from '../components/PageHeader'
import {PageLayout} from '../components/PageLayout'
import {Card} from '@usevenice/ui'
import {PlaidLogo} from '@usevenice/ui/logos'

// for server-side
import {serverGetUser} from '../server'

interface ServerSideProps {}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  ctx,
) => {
  const [user] = await serverGetUser(ctx)
  if (!user?.id) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      },
    }
  }
  return {props: {}}
}

export default function Page(props: ServerSideProps) {
  return (
    <PageLayout title="Integrations">
      <PageHeader title={['Integrations']} />
      <div className="p-10">
        <Card className="grid h-[10rem] w-[8rem] justify-center gap-2 p-6">
          <span className="text-center font-mono text-base text-offwhite">
            Plaid
          </span>
          <PlaidLogo className="h-16 w-16" />
        </Card>
      </div>
    </PageLayout>
  )
}
