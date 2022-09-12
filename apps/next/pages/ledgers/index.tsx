import {useRouter} from 'next/router'
import {CaretRight} from 'phosphor-react'
import {useState} from 'react'

import {useLedgerSyncAdmin} from '@ledger-sync/engine-frontend'

import {Layout} from '../../components/Layout'

export default function HomeScreen() {
  const router = useRouter()
  const [ledgerId, setLedgerId] = useState('')
  const {ledgerIdsRes} = useLedgerSyncAdmin({ledgerIdKeywords: ledgerId})
  const ledgerIds = ledgerIdsRes.data
  return (
    <Layout>
      <div className="mx-auto flex w-full max-w-screen-2xl flex-1 flex-col items-center justify-center py-8">
        <div className="flex w-full max-w-3xl flex-col">
          <form
            onSubmit={(event) => {
              event.preventDefault()
              void router.push(`/ledgers/${ledgerId}`)
            }}>
            <div className="form-control">
              <label htmlFor="ledgerId" className="label">
                <span className="label-text">Enter ledger ID</span>
              </label>

              <div className="flex flex-row items-center space-x-2">
                <input
                  type="text"
                  required
                  minLength={1}
                  placeholder="e.g. 00214199232302"
                  id="ledgerId"
                  value={ledgerId}
                  onChange={(event) => setLedgerId(event.currentTarget.value)}
                  className="input-bordered input w-full"
                />

                <button className="btn btn-primary text-lg" type="submit">
                  Enter
                </button>
              </div>
            </div>
          </form>

          <div className="grid grid-cols-1 divide-y py-8">
            {ledgerIds?.map((l) => (
              <div
                key={l.id}
                className="card border border-base-content/25 transition-[transform,shadow] hover:scale-105 hover:shadow-lg"
                onClick={() => router.push(`/ledgers/${l.id}`)}>
                <div className="card-body">
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col space-y-1">
                      <span className="card-title text-base text-black">
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
      </div>
    </Layout>
  )
}
