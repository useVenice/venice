'use client'

import {QueryClientProvider} from '@tanstack/react-query'
import React from 'react'
import {SqlExplorer} from '../components/api-access/SqlExplorer'
import {createQueryClient} from '../lib/query-client'

export default function Home() {
  const {current: queryClient} = React.useRef(createQueryClient())
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen w-screen">
        <SqlExplorer />
      </div>
    </QueryClientProvider>
  )
}
