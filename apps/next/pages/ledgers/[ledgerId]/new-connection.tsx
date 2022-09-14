import Head from 'next/head'
import {useRouter} from 'next/router'
import {Plus} from 'phosphor-react'
import React from 'react'
import {match} from 'ts-pattern'
import {createEnumParam, useQueryParam, withDefault} from 'use-query-params'

import type {EnvName, Id} from '@ledger-sync/cdk-core'
import {zEnvName} from '@ledger-sync/cdk-core'
import {useLedgerSync} from '@ledger-sync/engine-frontend'
import {compact} from '@ledger-sync/util'

import {Layout} from '../../../components/Layout'
import {Loading} from '../../../components/Loading'
import {Radio, RadioGroup} from '../../../components/RadioGroup'
import {Tab, TabContent, TabList, Tabs} from '../../../components/Tabs'
import {useDeveloperMode} from '../../../contexts/PortalParamsContext'

type ConnectMode = 'institution' | 'provider'

export default function LedgerNewConnectionScreen() {
  const router = useRouter()
  const {ledgerId} = router.query as {ledgerId: Id['ldgr']}
  const [mode, setMode] = useQueryParam(
    'mode',
    withDefault(
      createEnumParam<ConnectMode>(['institution', 'provider']),
      'institution' as ConnectMode,
    ),
  )
  const [envName, setEnvName] = React.useState<EnvName>('sandbox')
  const [keywords, setKeywords] = React.useState('')
  const {
    integrationsRes,
    connect: _connect,
    ...ls
  } = useLedgerSync({
    ledgerId,
    envName,
    keywords,
  })

  const connect = React.useCallback(
    (...args: Parameters<typeof _connect>) => {
      _connect(...args)
        .finally(() => {
          void router.replace(`/ledgers/${ledgerId}`)
        })
        .then((res) => {
          console.log('connect success', res)
        })
        .catch((err) => {
          console.error('connect error', err)
        })
    },
    [_connect, router, ledgerId],
  )

  const developerMode = useDeveloperMode()
  const onlyIntegrationId =
    integrationsRes.data?.length === 1 && !developerMode
      ? integrationsRes.data[0]?.id
      : undefined

  React.useEffect(() => {
    if (!onlyIntegrationId || integrationsRes.isLoading) {
      return
    }
    connect({id: onlyIntegrationId}, {})
  }, [connect, integrationsRes.isLoading, onlyIntegrationId])

  return (
    <>
      <Head>
        <title>LedgerSync | Viewing as {ledgerId} | Connect</title>
      </Head>

      <Layout
        title={`Viewing as ${ledgerId}`}
        links={[
          {label: 'My connections', href: `/ledgers/${ledgerId}`},
          {
            label: 'New connection',
            href: `/ledgers/${ledgerId}/new-connection`,
            primary: true,
          },
        ]}>
        {!onlyIntegrationId && !integrationsRes.isLoading && (
          <Tabs
            value={mode}
            onValueChange={(newMode) => setMode(newMode as ConnectMode)}>
            <TabList className="border-b border-gray-100">
              <Tab value="institution">By institution</Tab>
              <Tab value="provider">By provider (Developer mode)</Tab>
            </TabList>

            <TabContent
              value="institution"
              className="mx-auto hidden w-full max-w-screen-2xl flex-1 flex-col space-y-8 overflow-y-auto px-4 py-8 radix-state-active:flex md:px-8">
              <div className="form-control">
                <label htmlFor="keywords" className="label">
                  <span className="label-text">Search institutions</span>
                </label>

                <input
                  type="text"
                  required
                  minLength={1}
                  placeholder="e.g. Chase, Amex"
                  id="keywords"
                  value={keywords}
                  onChange={(event) => setKeywords(event.currentTarget.value)}
                  className="input-bordered input w-full"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {match(ls.insRes)
                  .with({status: 'loading'}, () => <Loading />)
                  .with({status: 'success'}, (res) =>
                    res.data.length === 0 ? (
                      <span className="text-xs">No results</span>
                    ) : (
                      res.data.map(({ins, int}) => (
                        <div
                          key={`${ins.id}`}
                          className="card border border-base-content/25 transition-[transform,shadow] hover:scale-105 hover:shadow-lg">
                          <div className="card-body space-y-4">
                            <div className="flex items-center space-x-4">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={ins.logoUrl}
                                alt={`"${ins.name}" logo`}
                                className="h-12 w-12 object-contain"
                              />

                              <div className="flex flex-col space-y-1">
                                <span className="card-title text-black">
                                  {ins.name}
                                </span>
                                <span className="text-sm">
                                  {compact([ins.id, int.id, ins.envName]).join(
                                    ':',
                                  )}
                                </span>
                              </div>

                              <div className="flex flex-1 justify-end">
                                <button
                                  className="btn-outline btn btn-sm btn-circle border-base-content/25"
                                  onClick={() =>
                                    connect(int, {institutionId: ins.id})
                                  }>
                                  <Plus />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ),
                  )
                  .run()}
              </div>
            </TabContent>

            <TabContent
              value="provider"
              className="mx-auto hidden w-full max-w-screen-md flex-1 flex-col space-y-8 overflow-y-auto px-4 py-8 radix-state-active:flex md:px-8">
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
                {integrationsRes.data?.map((int) => (
                  <button
                    key={`${int.id}-${int.provider}`}
                    className="h-12 rounded-lg bg-primary px-5 text-white"
                    onClick={() => connect(int, {})}>
                    {int.id} {int.provider}
                  </button>
                ))}
              </div>
            </TabContent>
          </Tabs>
        )}
      </Layout>
    </>
  )
}
