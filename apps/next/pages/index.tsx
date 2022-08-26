// import HotglueConfig from '@hotglue/widget'
import {supabase} from '@ledger-sync/app'
import {
  Auth,
  HStack,
  Text,
  ThemeToggle,
  Toaster,
  VStack,
} from '@ledger-sync/app-ui'
// eslint-disable-next-line import/no-extraneous-dependencies
import {Button} from '@supabase/ui'
import Head from 'next/head'
import {useRouter} from 'next/router'

// import {syncHooks} from './_app'

export function LinkUI() {
  // const ls = syncHooks.useConnect()

  return (
    <VStack css={{alignItems: 'center'}}>
      {/* <Button css={{marginBottom: '$2'}} onClick={ls.showConnect}>
        Connect
      </Button> */}
    </VStack>
  )
}

export default function Home() {
  const {user} = Auth.useUser()

  const router = useRouter()
  return (
    <>
      <Head>
        <title>LedgerSync Link Demo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <VStack
        gap="md"
        css={{
          width: '100%',
          height: '100%',
          maxWidth: '$bpsm',
          maxHeight: '100vh',
          marginX: 'auto',
        }}>
        <HStack justify="between" align="center" gap="md" css={{padding: '$4'}}>
          <Text as={'h1' as any} size="3xl">
            LedgerSync Link
          </Text>
          <Button
            onClick={() => {
              // Not sure how to navigate to 'workspaces' screen,
              // for now use this for testing purposes
              router.push('/workspaces')
            }}>
            See workspaces
          </Button>

          <ThemeToggle />
        </HStack>

        <VStack>
          {user ? (
            <>
              <Text>
                Logged in as {user?.email} {user?.id}
              </Text>
              <Button onClick={() => supabase.auth.signOut()}>Logout</Button>
            </>
          ) : (
            <Auth supabaseClient={supabase} />
          )}
        </VStack>
      </VStack>

      <Toaster />
    </>
  )
}
