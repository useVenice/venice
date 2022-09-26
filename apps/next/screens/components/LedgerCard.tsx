import {CaretRight} from 'phosphor-react'

import type {LedgerIdResultRow} from '@usevenice/cdk-core'

import {useRouterPlus} from '../../contexts/atoms'

export function LedgerCard({ledger: l}: {ledger: LedgerIdResultRow}) {
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
