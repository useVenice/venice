import {R} from '@alka/util'
import Head from 'next/head'
import {Toaster} from 'react-hot-toast'
import {Button, HStack, Text, ThemeToggle, VStack} from '../client'
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
        <VStack css={{alignItems: 'flex-start'}}>
          {R.values(syncHooks.preConnectInputs).map((opts) => (
            <Button
              css={{marginBottom: '$2'}}
              key={opts.key}
              onClick={() => ls.connect(opts.int, opts)}>
              Connect {opts.label}
            </Button>
          ))}
        </VStack>
      </VStack>

      <Toaster />
    </>
  )
}
