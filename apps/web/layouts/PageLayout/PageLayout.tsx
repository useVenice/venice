import Head from 'next/head'
import type {PropsWithChildren} from 'react'
import {AuthLayout} from './AuthLayout'

interface PageLayoutProps extends PropsWithChildren {
  requiresAuthentication?: boolean
  title: string
}

export function PageLayout({
  children,
  requiresAuthentication = true,
  title,
}: PageLayoutProps) {
  return (
    <>
      <Head>
        <title>Venice - {title}</title>
      </Head>

      {requiresAuthentication ? <AuthLayout>{children}</AuthLayout> : children}
    </>
  )
}
