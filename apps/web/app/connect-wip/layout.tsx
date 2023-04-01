'use client'

import {QueryClientProvider} from '@tanstack/react-query'
import {veniceCommonConfig} from '@usevenice/app-config/commonConfig'
import {VeniceProvider} from '@usevenice/engine-frontend'
import React from 'react'
import {createQueryClient} from '../../lib/query-client'

export default function Layout(props: {children: React.ReactNode}) {
  const {current: queryClient} = React.useRef(createQueryClient())
  return (
    <QueryClientProvider client={queryClient}>
      <VeniceProvider
        queryClient={queryClient}
        config={veniceCommonConfig}
        accessToken={undefined}
        developerMode={false}>
        {props.children}
      </VeniceProvider>
    </QueryClientProvider>
  )
}
