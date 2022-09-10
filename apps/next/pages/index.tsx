import {useRouter} from 'next/router'
import {CaretRight} from 'phosphor-react'
import {useState} from 'react'
import {createEnumParam, useQueryParam, withDefault} from 'use-query-params'

import {Layout} from '../components/Layout'
import {Tab, TabContent, TabList, Tabs} from '../components/Tabs'

type ConnectMode = 'enter' | 'search'

export default function HomeScreen() {
  const router = useRouter()
  const [ledgerId, setLedgerId] = useState('')
  const [mode, setMode] = useQueryParam(
    'mode',
    withDefault(
      createEnumParam<ConnectMode>(['enter', 'search']),
      'enter' as ConnectMode,
    ),
  )
  return (
    <Layout>
      <div className="mx-auto flex w-full max-w-screen-2xl flex-1 flex-col items-center justify-center py-8">
        <div className="py-8 text-center">
          <h1 className="pb-2 text-2xl font-bold text-black">LedgerSync</h1>
          <p>
            Bring to the table win-win survival strategies to ensure proactive
            domination.
          </p>
        </div>
        <Tabs
          value={mode}
          onValueChange={(newMode) => setMode(newMode as ConnectMode)}
          className="pt-4">
          <TabList className="flex flex-wrap border-b border-gray-200 text-center text-sm font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400">
            <Tab value="enter">Enter Ledger ID</Tab>
            <Tab value="search">Select from Existing</Tab>
          </TabList>

          <TabContent
            value="enter"
            className="mx-auto hidden w-full flex-col overflow-y-auto px-4 py-8 radix-state-active:flex md:px-8">
            <div className="w-96">
              <form
                onSubmit={(event) => {
                  event.preventDefault()
                  router.push(`/ledgers/${ledgerId}`)
                }}>
                <div className="form-control">
                  <label htmlFor="ledgerId" className="label">
                    <span className="label-text">Ledger ID</span>
                  </label>
                  <div className="flex flex-row items-center space-x-2">
                    <input
                      type="text"
                      required
                      minLength={1}
                      placeholder="Ex: 00214199232302"
                      id="ledgerId"
                      value={ledgerId}
                      onChange={(e) => setLedgerId(e.target.value)}
                      className="input-bordered input w-full"
                    />

                    <button className="btn btn-primary text-lg" type="submit">
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </TabContent>

          <TabContent
            value="search"
            className="mx-auto hidden w-full flex-1 flex-col overflow-y-auto px-4 py-8 radix-state-active:flex md:px-8">
            <div className="flex w-96 flex-col">
              <form
                onSubmit={(event) => {
                  event.preventDefault()
                  router.push(`/ledgers/${ledgerId}`)
                }}>
                <div className="form-control">
                  <label htmlFor="ledgerId" className="label">
                    <span className="label-text">Search ID or Name</span>
                  </label>
                  <div className="flex flex-row items-center space-x-2">
                    <input
                      type="text"
                      required
                      minLength={1}
                      placeholder="Ex: 00214199232302"
                      id="ledgerId"
                      value={ledgerId}
                      onChange={(e) => setLedgerId(e.target.value)}
                      className="input-bordered input w-full"
                    />

                    <button className="btn btn-primary text-lg" type="submit">
                      Search
                    </button>
                  </div>
                </div>
              </form>
              <div className="grid grid-cols-1 divide-y py-8">
                <div className="card rounded-none transition-[transform,shadow] hover:scale-105 hover:shadow-lg">
                  <div className="card-body px-2">
                    <div className="flex items-center space-x-4 px-2">
                      <div className="flex flex-col space-y-1">
                        <span className="card-title text-base	 text-black">
                          Tony
                        </span>
                        <span className="text-sm">00214199232302</span>
                      </div>

                      <div className="flex flex-1 justify-end">
                        <button className="btn-outline btn btn-sm btn-circle border-base-content/25">
                          <CaretRight />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card rounded-none transition-[transform,shadow] hover:scale-105 hover:shadow-lg">
                  <div className="card-body px-2">
                    <div className="flex items-center space-x-4 px-2">
                      <div className="flex flex-col space-y-1">
                        <span className="card-title text-base	text-black">
                          Alka
                        </span>
                        <span className="text-sm">00214199232302</span>
                      </div>

                      <div className="flex flex-1 justify-end">
                        <button className="btn-outline btn btn-sm btn-circle border-base-content/25">
                          <CaretRight />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabContent>
        </Tabs>
      </div>
    </Layout>
  )
}
