import {supabase} from '@ledger-sync/app'
import {
  Auth,
  Button,
  HStack,
  Text,
  ThemeToggle,
  Toaster,
  VStack
} from '@ledger-sync/app-ui'
import Head from 'next/head'
import {syncHooks} from './_app'

export default function Home() {
  const ls = syncHooks.useConnect()

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

          <ThemeToggle />
        </HStack>

        <VStack css={{alignItems: 'center'}}>
          <Button css={{marginBottom: '$2'}} onClick={ls.showConnect}>
            Connect
          </Button>
        </VStack>
        <VStack>
          <Auth supabaseClient={supabase} />
        </VStack>
      </VStack>

      <Toaster />
    </>
  )
}
