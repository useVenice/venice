'use client'

import {QueryClientProvider} from '@tanstack/react-query'
import {veniceCommonConfig} from '@usevenice/app-config/commonConfig'
import {VeniceProvider} from '@usevenice/engine-frontend'
import React from 'react'
import type {DehydratedState} from '../components/SuperHydrate'
import {SuperHydrate} from '../components/SuperHydrate'
import {createQueryClient} from '../lib/query-client'

export function ClientRoot(props: {
  children: React.ReactNode
  accessToken?: string
  dehydratedState?: DehydratedState
}) {
  const {current: queryClient} = React.useRef(createQueryClient())
  return (
    <QueryClientProvider client={queryClient}>
      <SuperHydrate dehydratedState={props.dehydratedState}>
        <VeniceProvider
          queryClient={queryClient}
          config={veniceCommonConfig}
          accessToken={props.accessToken}
          developerMode={false}>
          {props.children}
        </VeniceProvider>
      </SuperHydrate>
    </QueryClientProvider>
  )
}
