import {
  Button,
  HStack,
  ThemeToggle,
  Toaster,
  Typography,
  VStack,
} from '@ledger-sync/app-ui'
import Head from 'next/head'
import {useRouter} from 'next/router'
import {syncHooks} from '../_app'

export function LinkUI() {
  const ls = syncHooks.useConnect()

  // console.log('ls.listIntegrationsRes.data', ls.listIntegrationsRes.data)
  return (
    <VStack css={{alignItems: 'center'}}>
      {ls.listIntegrationsRes.data?.map((opt) => (
        <Button
          key={opt.key}
          onClick={() => {
            ls.connect(opt.int, opt)
          }}>
          {opt.int.id} {opt.int.provider} {opt.label}
        </Button>
      ))}
    </VStack>
  )
}

export default function LedgerScreen() {
  const router = useRouter()
  const {ledgerId} = router.query

  return (
    <>
      <Head>
        <title>Viewing as {ledgerId}</title>
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
          <Typography.Title level={3}>Viewing as {ledgerId}</Typography.Title>
          <ThemeToggle />
        </HStack>

        <VStack>
          <LinkUI />
        </VStack>
      </VStack>
      <Toaster />
    </>
  )
}
