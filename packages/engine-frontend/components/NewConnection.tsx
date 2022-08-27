import {EnvName, zEnvName} from '@ledger-sync/cdk-core'
import {Button, HStack, Radio, VStack} from '@ledger-sync/uikit'
import React from 'react'
import {useLedgerSync} from '../useLedgerSync'

export function NewConnection(ctx: {ledgerId: string}) {
  const [envName, setEnvName] = React.useState<EnvName>('sandbox')
  const ls = useLedgerSync({ledgerId: ctx.ledgerId, envName})

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
              ls.connect(opt.int, opt as any)
            }}>
            {opt.int.id} {opt.int.provider} {opt.label}
          </Button>
        ))}
      </VStack>
    </HStack>
  )
}
