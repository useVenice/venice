import {useState} from 'react'
import {match} from 'ts-pattern'

import {useVeniceAdmin} from '@usevenice/engine-frontend'
import {Container, Loading} from '@usevenice/ui'

import {useRouterPlus} from '../contexts/atoms'
import {LedgerCard} from './components/LedgerCard'

export function AdminHomeScreen() {
  const router = useRouterPlus()
  const [creatorId, setCreatorId] = useState('')
  const {creatorIdsRes} = useVeniceAdmin({creatorIdKeywords: creatorId})
  return (
    <Container className="flex-1 overflow-y-auto">
      <div className="mx-auto flex w-full max-w-3xl flex-col">
        <form
          onSubmit={(event) => {
            event.preventDefault()
            void router.pushPathname(`/users/${creatorId}`)
          }}>
          <div className="form-control">
            <label htmlFor="userId" className="label">
              <span className="label-text">User ID</span>
            </label>

            <div className="flex flex-row items-center space-x-2">
              <input
                type="text"
                required
                minLength={1}
                placeholder="e.g. 00214199232302"
                id="userId"
                value={creatorId}
                onChange={(event) => setCreatorId(event.currentTarget.value)}
                className="input-bordered input w-full"
              />

              <button className="btn btn-primary text-lg" type="submit">
                Go
              </button>
            </div>
          </div>
        </form>

        <div className="py-8">
          {match(creatorIdsRes)
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
