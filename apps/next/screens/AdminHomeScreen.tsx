import {CaretRight} from 'phosphor-react'
import {useState} from 'react'
import {match} from 'ts-pattern'

import type {LedgerIdResultRow} from '@ledger-sync/cdk-core'
import {useLedgerSyncAdmin} from '@ledger-sync/engine-frontend'

import {Container} from '../components/Container'
import {Layout} from '../components/Layout'
import {Loading} from '../components/Loading'
import {useRouterPlus} from '../contexts/atoms'

export function AdminHomeScreen() {
  const router = useRouterPlus()

  const [ledgerId, setLedgerId] = useState('')
  const {ledgerIdsRes} = useLedgerSyncAdmin({ledgerIdKeywords: ledgerId})
  return (
    <Layout>
      <Container className="flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-3xl flex-col">
          <form
            onSubmit={(event) => {
              event.preventDefault()
              void router.pushPathname(`/ledgers/${ledgerId}`)
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
                  placeholder="e.g. 00214199232302"
                  id="ledgerId"
                  value={ledgerId}
                  onChange={(event) => setLedgerId(event.currentTarget.value)}
                  className="input-bordered input w-full"
                />

                <button className="btn btn-primary text-lg" type="submit">
                  Go
                </button>
              </div>
            </div>
          </form>

          <div className="py-8">
            {match(ledgerIdsRes)
              .with({status: 'idle'}, () => null)
              .with({status: 'loading'}, () => <Loading />)
              .with({status: 'error'}, () => (
                <span className="text-xs">Something went wrong</span>
              ))
              .with({status: 'success'}, (res) =>
                res.data.length === 0 ? (
                  <span className="text-xs">No results</span>
                ) : (
                  <div className="grid grid-cols-1 divide-y">
                    {res.data.map((l) => (
                      <LedgerCard key={l.id} ledger={l} />
                    ))}
                  </div>
                ),
              )
              .exhaustive()}
          </div>
        </div>
      </Container>
    </Layout>
  )
}

function LedgerCard({ledger: l}: {ledger: LedgerIdResultRow}) {
  const router = useRouterPlus()
  return (
    <div
      className="card border border-base-content/25 transition-[transform,shadow] hover:scale-105 hover:shadow-lg"
      onClick={() => router.pushPathname(`/ledgers/${l.id}`)}>
      <div className="card-body">
        <div className="flex items-center space-x-4">
          <div className="flex flex-col space-y-1">
            <span className="card-title text-base text-black">{l.id}</span>
            <span className="text-sm"># Connections: {l.connectionCount}</span>
            <span className="text-sm">First connected: {l.firstCreatedAt}</span>
            <span className="text-sm">Last updated: {l.lastUpdatedAt}</span>
          </div>

          <div className="flex flex-1 justify-end">
            <button className="btn-outline btn btn-sm btn-circle border-base-content/25">
              <CaretRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
