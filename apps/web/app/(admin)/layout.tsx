import './global.css'

// import {TRPCProvider} from '@usevenice/engine-frontend'
import {cookies} from 'next/headers'
import React from 'react'
import {serverGetViewer} from '../../server'
import {ClientRoot} from '../../contexts/ClientRoot'

export default async function AdminLayout(props: {children: React.ReactNode}) {
  console.log('[AdminLayout] rendering')
  // We only get the viewer from cookies to be consistent with how it works
  // createBrowserSupabaseClient which only uses cookie and does not use header etc.
  const {accessToken} = await serverGetViewer({cookies})

  return (
    <ClientRoot initialAccessToken={accessToken}>{props.children}</ClientRoot>
  )
}
