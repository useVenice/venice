import {useState} from 'react'
import {match} from 'ts-pattern'

import {useLedgerSyncAdmin} from '@ledger-sync/engine-frontend'
import {Container, Loading} from '@ledger-sync/ui'

import {useRouterPlus} from '../contexts/atoms'
import {LedgerCard} from './components/LedgerCard'

export function AdminHomeScreen() {
  const router = useRouterPlus()
  const [ledgerId, setLedgerId] = useState('')
  const {ledgerIdsRes} = useLedgerSyncAdmin({ledgerIdKeywords: ledgerId})
  return (
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
              <span className="text-sm">Something went wrong</span>
            ))
            .with({status: 'success'}, (res) =>
              res.data.length === 0 ? (
                <span className="text-sm">No results</span>
              ) : (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
  )
}
