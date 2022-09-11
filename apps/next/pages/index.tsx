import {useRouter} from 'next/router'
import {CaretRight} from 'phosphor-react'
import {useState} from 'react'

import {useLedgerSyncDevInfo} from '@ledger-sync/engine-frontend'

import {Layout} from '../components/Layout'
import {TabContent, Tabs} from '../components/Tabs'

export default function HomeScreen() {
  const router = useRouter()
  const [ledgerId, setLedgerId] = useState('')

  const {ledgerIdsRes} = useLedgerSyncDevInfo({ledgerIdKeywords: ledgerId})

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
        <Tabs value="default" className="pt-4">
          <TabContent
            value="default"
            className="mx-auto hidden w-full flex-1 flex-col overflow-y-auto px-4 py-8 radix-state-active:flex md:px-8">
            <div className="flex w-96 flex-col">
              <form
                onSubmit={(event) => {
                  event.preventDefault()
                  router.push(`/ledgers/${ledgerId}`)
                }}>
                <div className="form-control">
                  <label htmlFor="ledgerId" className="label">
                    <span className="label-text">
                      Search or enter ledger Id
                    </span>
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
                      Enter
                    </button>
                  </div>
                </div>
              </form>
              <div className="grid grid-cols-1 divide-y py-8">
                {ledgerIdsRes.data?.map((l) => (
                  <div
                    key={l.id}
                    className="card rounded-none transition-[transform,shadow] hover:scale-105 hover:shadow-lg"
                    onClick={() => router.push(`/ledgers/${l.id}`)}>
                    <div className="card-body px-2">
                      <div className="flex items-center space-x-4 px-2">
                        <div className="flex flex-col space-y-1">
                          <span className="card-title text-base	 text-black">
                            {l.id}
                          </span>
                          <span className="text-sm">
                            # Connections: {l.connectionCount}
                          </span>
                          <span className="text-sm">
                            First connected: {l.firstCreatedAt}
                          </span>
                          <span className="text-sm">
                            Last updated: {l.lastUpdatedAt}
                          </span>
                        </div>

                        <div className="flex flex-1 justify-end">
                          <button className="btn-outline btn btn-sm btn-circle border-base-content/25">
                            <CaretRight />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabContent>
        </Tabs>
      </div>
    </Layout>
  )
}
