import {EnvName, zEnvName} from '@ledger-sync/cdk-core'
import {useLedgerSync} from '@ledger-sync/engine-frontend'
import Head from 'next/head'
import {useRouter} from 'next/router'
import React from 'react'
import {tw} from 'twind'
import {createEnumParam, useQueryParam, withDefault} from 'use-query-params'
import {Layout} from '../../../components/Layout'
import {Radio, RadioGroup} from '../../../components/RadioGroup'
import {Tab, TabContent, TabList, Tabs} from '../../../components/Tabs'

type ConnectMode = 'institution' | 'provider'

export default function LedgerNewConnectionScreen() {
  const router = useRouter()
  const {ledgerId} = router.query as {ledgerId: string}
  const [mode, setMode] = useQueryParam(
    'mode',
    withDefault(
      createEnumParam<ConnectMode>(['institution', 'provider']),
      'institution' as ConnectMode,
    ),
  )
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
        <Tabs
          value={mode}
          onValueChange={(newMode) => setMode(newMode as ConnectMode)}>
          <TabList className={tw`border-b border-gray-100`}>
            <Tab value="institution">By institution</Tab>
            <Tab value="provider">By provider (Developer mode)</Tab>
          </TabList>

          <TabContent
            value="institution"
            className={tw`radix-state-active:(flex flex-col flex-1 p-8 mx-auto overflow-y-auto space-y-4)`}>
            {ls.insRes.data?.map(({ins, int}) => (
              <div key={`${ins.id}`} className={tw`flex flex-col space-y-4`}>
                <img
                  src={ins.logoUrl}
                  alt={`"${ins.name}" logo`}
                  className={tw`h-32 p-2 bg-gray-100 border-2 border-gray-200 rounded-lg object-contain`}
                />

                <button
                  className={tw`h-12 px-5 text-white bg-primary rounded-lg`}
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
                </button>
              </div>
            ))}
          </TabContent>

          <TabContent
            value="provider"
            className={tw`radix-state-active:(flex flex-col flex-1 p-8 mx-auto max-w-screen-2xl overflow-y-auto space-y-8)`}>
            <RadioGroup
              name="grouped-radios"
              label="Environment"
              orientation="horizontal"
              value={envName}
              onValueChange={(newValue) => setEnvName(newValue as EnvName)}>
              {zEnvName.options.map((o) => (
                <Radio key={o} id={o} label={o} value={o} />
              ))}
            </RadioGroup>

            <div className={tw`flex flex-col space-y-2`}>
              {ls.preConnectOptionsRes.data?.map((opt) => (
                <button
                  key={`${opt.int.id}-${opt.int.provider}-${opt.key}`}
                  className={tw`h-12 px-5 text-white bg-primary rounded-lg`}
                  onClick={() => {
                    ls.connect(opt.int, opt as any)
                  }}>
                  {opt.int.id} {opt.int.provider} {opt.label}
                </button>
              ))}
            </div>
          </TabContent>
        </Tabs>
      </Layout>
    </>
  )
}
