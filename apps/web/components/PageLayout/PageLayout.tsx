import Head from 'next/head'
import type {PropsWithChildren} from 'react'
import {AuthLayout} from './AuthLayout'

interface PageLayoutProps extends PropsWithChildren {
  auth?: 'user' | 'admin' | null
  title: string
}

/** TODO: Default auth = admin */
export function PageLayout({children, auth = 'admin', title}: PageLayoutProps) {
  const pageTitle = `Venice - ${title}`
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>

      {auth ? (
        <AuthLayout adminOnly={auth === 'admin'}>{children}</AuthLayout>
      ) : (
        children
      )}
    </>
  )
}
