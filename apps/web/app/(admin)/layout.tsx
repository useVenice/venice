import '../global.css'

// import {TRPCProvider} from '@usevenice/engine-frontend'
import {cookies} from 'next/headers'
import React from 'react'
import {serverGetViewer} from '../../server'
import {AdminLayout} from './AdminLayout'

export default async function AdminLayoutServer({
  children,
}: {
  children: React.ReactNode
}) {
  console.log('[AdminLayoutServer] rendering')
  // We only get the viewer from cookies to be consistent with how it works
  // createBrowserSupabaseClient which only uses cookie and does not use header etc.
  const viewer = await serverGetViewer({cookies})

  return <AdminLayout initialViewer={viewer}>{children}</AdminLayout>
}
