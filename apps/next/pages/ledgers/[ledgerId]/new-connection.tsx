import Head from 'next/head'
import {useRouter} from 'next/router'
import {Plus} from 'phosphor-react'
import React from 'react'
import {createEnumParam, useQueryParam, withDefault} from 'use-query-params'

import type {EnvName, Id} from '@ledger-sync/cdk-core'
import {zEnvName} from '@ledger-sync/cdk-core'
import {useLedgerSync} from '@ledger-sync/engine-frontend'
import {compact} from '@ledger-sync/util'

import {Layout} from '../../../components/Layout'
import {Radio, RadioGroup} from '../../../components/RadioGroup'
import {Tab, TabContent, TabList, Tabs} from '../../../components/Tabs'

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
  const ls = useLedgerSync({ledgerId, envName, keywords})
  const institutions = ls.insRes.data
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
            className="mx-auto hidden w-full max-w-screen-2xl flex-1 flex-col overflow-y-auto px-4 py-8 radix-state-active:flex md:px-8">
            <form
              onSubmit={(event) => {
                event.preventDefault()
                router.push(`/ledgers/${ledgerId}`)
              }}
              className="pb-8">
              <div className="form-control">
                <label htmlFor="searchInstitution" className="label">
                  <span className="label-text">Search Institution</span>
                </label>
                <div className="flex flex-row items-center space-x-2">
                  <input
                    type="text"
                    required
                    minLength={1}
                    placeholder="Ex: Chase or Amex"
                    id="searchInstitution"
                    className="input-bordered input w-full"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                  />

                  <button
                    className="btn btn-primary px-8 text-lg"
                    type="submit">
                    Search
                  </button>
                </div>
              </div>
            </form>
            <div className="flex flex-1 items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {institutions?.map(({ins, int}) => (
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
                          {compact([ins.id, int.id, ins.envName]).join(':')}
                        </span>
                      </div>

                      <div className="flex flex-1 justify-end">
                        <button
                          className="btn-outline btn btn-sm btn-circle border-base-content/25"
                          onClick={() => {
                            ls.connect(int, {institutionId: ins.id})
                          }}>
                          <Plus />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
              {ls.integrationsRes.data?.map((int) => (
                <button
                  key={`${int.id}-${int.provider}`}
                  className="h-12 rounded-lg bg-primary px-5 text-white"
                  onClick={() => {
                    ls.connect(int, {})
                  }}>
                  {int.id} {int.provider}
                </button>
              ))}
            </div>
          </TabContent>
        </Tabs>
      </Layout>
    </>
  )
}
