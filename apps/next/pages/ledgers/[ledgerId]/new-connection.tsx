import {EnvName, zEnvName} from '@ledger-sync/cdk-core'
import {useLedgerSync} from '@ledger-sync/engine-frontend'
import {objectEntries, objectKeys} from '@ledger-sync/util'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import {Button, Radio} from '@supabase/ui'
import Head from 'next/head'
import {useRouter} from 'next/router'
import React from 'react'
import {tw} from 'twind'
import {Layout} from '../../../components/Layout'

type Tab = 'institution' | 'provider'

const TAB_LABEL_BY_VALUE: {
  [T in Tab]: string
} = {
  institution: 'By institution',
  provider: 'By provider (Developer mode)',
}

export default function LedgerNewConnectionScreen() {
  const router = useRouter()
  const {ledgerId} = router.query as {ledgerId: string}
  const [envName, setEnvName] = React.useState<EnvName>('sandbox')
  const ls = useLedgerSync({ledgerId, envName})
  return (
    <>
      <Head>
        <title>LedgerSync | Viewing as {ledgerId} | Connect</title>
      </Head>

      <Layout
        title={`Viewing as ${ledgerId}`}
        links={[
          {label: 'My connections', href: `/ledgers/${ledgerId}`},
          {label: 'Connect', href: `/ledgers/${ledgerId}/new-connection`},
        ]}>
        <TabsPrimitive.Root
          defaultValue="institution"
          className={tw`flex flex-col flex-1 overflow-y-hidden`}>
          <TabsPrimitive.List className={tw`flex flex-row`}>
            {objectEntries(TAB_LABEL_BY_VALUE).map(([value, label]) => (
              <TabsPrimitive.Trigger
                key={`tab-trigger-${value}`}
                value={value}
                className={tw`
                  flex-1 px-3 py-2 text-gray-500 border-b-4 border-transparent
                  radix-state-active:(text-primary border-primary)
                `}>
                <span className={tw`text-sm font-medium`}>{label}</span>
              </TabsPrimitive.Trigger>
            ))}
          </TabsPrimitive.List>

          <div
            className={tw`w-[30rem] flex flex-col mx-auto flex-1 py-8 overflow-y-auto`}>
            {objectKeys(TAB_LABEL_BY_VALUE).map((value) => (
              <TabsPrimitive.Content key={`tab-content-${value}`} value={value}>
                {(() => {
                  switch (value) {
                    case 'institution':
                      return (
                        <div className={tw`flex flex-col space-y-4`}>
                          {ls.insRes.data?.map(({ins, int}) => (
                            <div
                              key={`${ins.id}`}
                              className={tw`flex flex-col space-y-4`}>
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
                      )
                    case 'provider':
                      return (
                        <div className={tw`flex flex-row space-x-4`}>
                          <div className={tw`flex flex-col`}>
                            <Radio.Group
                              name="grouped-radios"
                              label="Environment"
                              layout="horizontal" // does not work...
                              onChange={(e) =>
                                setEnvName(e.target.value as EnvName)
                              }>
                              {zEnvName.options.map((o) => (
                                <Radio key={o} label={o} value={o} />
                              ))}
                            </Radio.Group>
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
                })()}
              </TabsPrimitive.Content>
            ))}
          </div>
        </TabsPrimitive.Root>
      </Layout>
    </>
  )
}
