import Head from 'next/head'
import type {PropsWithChildren} from 'react'
import {AuthLayout} from './AuthLayout/AuthLayout'

interface PageLayoutProps extends PropsWithChildren {
  requiresAuthentication?: boolean
  title: string
}

export function PageLayout({
  children,
  requiresAuthentication = true,
  title,
}: PageLayoutProps) {
  const pageTitle = `Venice - ${title}`
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>

      {requiresAuthentication ? <AuthLayout>{children}</AuthLayout> : children}
    </>
  )
}
