import type {GetServerSideProps} from 'next'
import {PageHeader} from '../components/PageHeader'
import {PageLayout} from '../components/PageLayout'

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
      <div className="p-6"></div>
    </PageLayout>
  )
}
