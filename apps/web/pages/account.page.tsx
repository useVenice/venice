import {Tabs, TabsContent, TabsTriggers} from '@usevenice/ui'
import {z} from '@usevenice/util'
import type {GetServerSideProps} from 'next'
import {PageHeader} from '../components/PageHeader'
import {PageLayout} from '../components/PageLayout'
import {serverGetUser} from '../server'
import {Profile, Security} from './account'

enum PrimaryTabsKey {
  profile = 'profile',
  security = 'security',
}

interface ServerSideProps {
  username: string
}

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

  // TODO when/why can user.email be null?
  const username = z.string().parse(user.email)
  return {
    props: {
      username,
    },
  }
}

export default function Page(props: ServerSideProps) {
  const {username} = props
  return (
    <PageLayout title="Account">
      <PageHeader title={['Account']} />
      <div className="p-6">
        <Tabs className="grid gap-6" defaultValue={PrimaryTabsKey.profile}>
          <TabsTriggers
            options={[
              {key: PrimaryTabsKey.profile, label: 'Profile'},
              // {key: PrimaryTabsKey.security, label: 'Security'},
            ]}
          />
          <TabsContent value={PrimaryTabsKey.profile}>
            <Profile username={username} />
          </TabsContent>
          {/* <TabsContent value={PrimaryTabsKey.security}>
            <Security />
          </TabsContent> */}
        </Tabs>
      </div>
    </PageLayout>
  )
}
