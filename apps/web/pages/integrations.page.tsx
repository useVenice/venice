import type {GetServerSideProps} from 'next'
import {PageHeader} from '../components/PageHeader'
import {PageLayout} from '../components/PageLayout'
import {Button, Card} from '@usevenice/ui'
import {PlaidLogo} from '@usevenice/ui/logos'
import {SettingsIcon} from '@usevenice/ui/icons'
import Link from 'next/link'

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

export default function Page() {
  return (
    <PageLayout title="Integrations">
      <PageHeader title={['Integrations']} />
      <div className="p-10">
        <Card className="flex w-32 flex-col gap-4 p-2">
          <span className="mt-2 text-center font-mono text-base text-offwhite">
            Plaid
          </span>
          <div className="flex items-center justify-center">
            <PlaidLogo className="h-16 w-16" />
          </div>
          <Button asChild className="mb-1">
            <Link href="/integrations/plaid">
              <SettingsIcon className="h-6 w-6 fill-current pr-2 text-gray" />
              Settings
            </Link>
          </Button>
        </Card>
      </div>
    </PageLayout>
  )
}
