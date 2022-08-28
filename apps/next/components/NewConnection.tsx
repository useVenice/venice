import {EnvName, zEnvName} from '@ledger-sync/cdk-core'
import {useLedgerSync} from '@ledger-sync/engine-frontend'
import {Button, Radio} from '@supabase/ui'
import React from 'react'
import {tw} from 'twind'

export function NewConnection(ctx: {ledgerId: string}) {
  const [envName, setEnvName] = React.useState<EnvName>('sandbox')
  const ls = useLedgerSync({ledgerId: ctx.ledgerId, envName})

  // console.log('ls.listIntegrationsRes.data', ls.listIntegrationsRes.data)

  return (
    <div className={tw`flex flex-row space-x-4`}>
      <div className={tw`flex flex-col`}>
        <Radio.Group
          name="grouped-radios"
          label="Environment"
          layout="horizontal" // does not work...
          onChange={(e) => setEnvName(e.target.value as EnvName)}>
          {zEnvName.options.map((o) => (
            <Radio key={o} label={o} value={o} />
          ))}
        </Radio.Group>
      </div>

      <div className={tw`flex flex-col space-y-4`}>
        {ls.insRes.data?.map(({ins, int}) => (
          <div key={`${ins.id}`} className={tw`flex flex-col space-y-4`}>
            <img src={ins.logoUrl} />
            <Button
              onClick={() => {
                ls.connect(int, {
                  key: ins.id,
                  label: ins.name,
                  // Temp haackkk...
                  options: {
                    envName: 'sandbox',
                    institutionId: ins.id,
                    userToken: '',
                    applicationId: '',
                  },
                })
              }}>
              {ins.name}
            </Button>
          </div>
        ))}
      </div>

      <div className={tw`flex flex-col space-y-4`}>
        {ls.preConnectOptionsRes.data?.map((opt) => (
          <Button
            key={`${opt.int.id}-${opt.int.provider}-${opt.key}`}
            onClick={() => {
              ls.connect(opt.int, opt as any)
            }}>
            {opt.int.id} {opt.int.provider} {opt.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
