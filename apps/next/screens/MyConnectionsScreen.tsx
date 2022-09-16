import {useAtomValue} from 'jotai'
import {match} from 'ts-pattern'

import {useLedgerSync} from '@ledger-sync/engine-frontend'
import {Container, Loading} from '@ledger-sync/ui'

import {envAtom} from '../contexts/atoms'
import {ConnectionCard} from './components/ConnectionCard'

export function MyConnectionsScreen() {
  const env = useAtomValue(envAtom)
  const {connectionsRes} = useLedgerSync({envName: env})
  return (
    <Container className="flex-1 overflow-y-auto">
      {match(connectionsRes)
        .with({status: 'idle'}, () => null)
        .with({status: 'loading'}, () => <Loading />)
        .with({status: 'error'}, () => (
          <span className="text-xs">Something went wrong</span>
        ))
        .with({status: 'success'}, (res) =>
          res.data.length === 0 ? (
            <span className="text-xs">No results</span>
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {res.data.map((conn) => (
                <ConnectionCard key={conn.id} connection={conn} />
              ))}
            </div>
          ),
        )
        .exhaustive()}
    </Container>
  )
}
