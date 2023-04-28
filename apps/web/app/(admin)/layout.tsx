import '../global.css'

// import {TRPCProvider} from '@usevenice/engine-frontend'
import {cookies, headers} from 'next/headers'
import React from 'react'
import {serverGetViewer} from '../../server'
import {AdminLayout} from './AdminLayout'

export default async function AdminLayoutServer({
  children,
}: {
  children: React.ReactNode
}) {
  console.log('[AdminLayoutServer] rendering')

  // make it so we can only get the viewer from cookies to be more consistent
  // with how it works client side...
  const viewer = await serverGetViewer({cookies, headers, params: {}})

  return <AdminLayout initialViewer={viewer}>{children}</AdminLayout>
}
