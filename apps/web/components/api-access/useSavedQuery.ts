import {useEffect, useMemo, useState} from 'react'

export interface SavedQuery {
  id: SavedQueryId
  displayName: string
  query: string
}

export enum SavedQueryId {
  institution = 'institution',
  pipeline = 'pipeline',
  posting = 'posting',
  raw_account = 'raw_account',
  raw_commodity = 'raw_commodity',
  raw_transaction = 'raw_transaction',
  resource = 'resource',
  transaction = 'transaction',
}

export function useSavedQuery(): {
  getById: (id: SavedQueryId) => SavedQuery | undefined
} {
  const savedQueryById: Map<SavedQueryId, SavedQuery> = useMemo(
    () =>
      new Map(
        Object.values(SavedQueryId).map((id) => [
          id,
          {
            id,
            displayName: id,
            query: `select * from ${id} limit 10;`,
          },
        ]),
      ),
    [],
  )

  return {
    getById: (id) => savedQueryById.get(id),
  }
}
