import {Layout} from '../../../components/Layout'
import {Radio, RadioGroup} from '../../../components/RadioGroup'
import {Tab, TabContent, TabList, Tabs} from '../../../components/Tabs'
import type {EnvName} from '@ledger-sync/cdk-core'
import {zEnvName} from '@ledger-sync/cdk-core'
import {useLedgerSync} from '@ledger-sync/engine-frontend'
import Head from 'next/head'
import {useRouter} from 'next/router'
import React from 'react'
import {createEnumParam, useQueryParam, withDefault} from 'use-query-params'

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
          <TabList className="border-b border-gray-100">
            <Tab value="institution">By institution</Tab>
            <Tab value="provider">By provider (Developer mode)</Tab>
          </TabList>

          <TabContent
            value="institution"
            className="mx-auto flex-1 flex-col overflow-y-auto p-8 radix-state-active:flex radix-state-active:space-y-4">
            {ls.insRes.data?.map(({ins, int}) => (
              <div key={`${ins.id}`} className="flex flex-col space-y-4">
                <img
                  src={ins.logoUrl}
                  alt={`"${ins.name}" logo`}
                  className="h-32 rounded-lg border-2 border-gray-200 bg-gray-100 object-contain p-2"
                />

                <button
                  className="h-12 rounded-lg bg-primary px-5 text-white"
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
            className="mx-auto max-w-screen-2xl flex-1 flex-col overflow-y-auto p-8 radix-state-active:flex radix-state-active:space-y-8">
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

            <div className="flex flex-col space-y-2">
              {ls.preConnectOptionsRes.data?.map((opt) => (
                <button
                  key={`${opt.int.id}-${opt.int.provider}-${opt.key}`}
                  className="h-12 rounded-lg bg-primary px-5 text-white"
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
