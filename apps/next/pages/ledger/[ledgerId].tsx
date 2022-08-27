import {EnvName, useLedgerSync, zEnvName} from '@ledger-sync/app-config'
import {
  Button,
  HStack,
  Radio,
  ThemeToggle,
  Toaster,
  Typography,
  VStack,
} from '@ledger-sync/uikit'
import Head from 'next/head'
import {useRouter} from 'next/router'
import React from 'react'

export function LinkUI() {
  const router = useRouter()
  const {ledgerId} = router.query
  const [envName, setEnvName] = React.useState<EnvName>('sandbox')
  const ls = useLedgerSync({
    ledgerId: ledgerId as string,
    envName,
  })

  // console.log('ls.listIntegrationsRes.data', ls.listIntegrationsRes.data)
  return (
    <HStack>
      <Radio.Group
        name="grouped-radios"
        label="Environment"
        layout="horizontal" // does not work...
        onChange={(e) => setEnvName(e.target.value as EnvName)}>
        {zEnvName.options.map((o) => (
          <Radio key={o} label={o} value={o} />
        ))}
      </Radio.Group>
      <VStack gap="sm">
        {ls.preConnectOptionsRes.data?.map((opt) => (
          <Button
            key={`${opt.int.id}-${opt.int.provider}-${opt.key}`}
            onClick={() => {
              ls.connect(opt.int, opt)
            }}>
            {opt.int.id} {opt.int.provider} {opt.label}
          </Button>
        ))}
      </VStack>
    </HStack>
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
