'use client'

import {QueryClientProvider} from '@tanstack/react-query'
import React from 'react'
import type {SqlExplorerProps} from '../components/api-access/SqlExplorer'
import {SqlExplorer} from '../components/api-access/SqlExplorer'
import {createQueryClient} from '../lib/query-client'

export function Scratchpad(props: SqlExplorerProps) {
  const {current: queryClient} = React.useRef(createQueryClient())
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen w-screen">
        <SqlExplorer {...props} />
      </div>
    </QueryClientProvider>
  )
}
