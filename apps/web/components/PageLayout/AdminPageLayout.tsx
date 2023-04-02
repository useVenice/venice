import Head from 'next/head'
import type {PropsWithChildren} from 'react'
import {AuthLayout} from './AuthLayout'

interface AdminPageLayoutProps extends PropsWithChildren {
  requiresAuthentication?: boolean
  title: string
}

/** TODO: Rename to AdminPageLayout */
export function AdminPageLayout({
  children,
  requiresAuthentication = true,
  title,
}: AdminPageLayoutProps) {
  const pageTitle = `Venice - ${title}`
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>

      {requiresAuthentication ? (
        <AuthLayout adminOnly>{children}</AuthLayout>
      ) : (
        children
      )}
    </>
  )
}
