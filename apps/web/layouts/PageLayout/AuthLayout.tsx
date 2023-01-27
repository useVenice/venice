import Image from 'next/image'
import Link from 'next/link'
import type {PropsWithChildren} from 'react'

import {RedirectTo} from '@usevenice/web/components/common-components'
import {EnhancedActiveLink} from '@usevenice/web/components/EnhancedActiveLink'
import {LoadingIndicatorOverlay} from '@usevenice/web/components/loading-indicators'
import {useSession} from '@usevenice/web/contexts/session-context'
import {AccountMenu} from './AccountMenu'

interface AuthLayoutProps extends PropsWithChildren {}

export function AuthLayout({children}: AuthLayoutProps) {
  const [session, {loading: isLoadingSession}] = useSession()

  if (isLoadingSession) {
    return <LoadingIndicatorOverlay />
  }

  if (!isLoadingSession && !session) {
    return <RedirectTo url="/auth" />
  }

  return (
    <div className="relative mx-auto flex min-h-screen max-w-screen-xl flex-col px-4">
      <header className="mt-4 flex shrink-0 items-center justify-between overflow-x-hidden py-4">
        <Link href="/pipelines" className="inline-flex">
          <Image
            src="/venice-logo.svg"
            alt="Venice Logo"
            width={102}
            height={32}
          />
        </Link>
        <nav className="flex items-center space-x-1 text-sm font-medium md:space-x-2">
          <NavLink href="/pipelines">Pipelines</NavLink>
          <NavLink href="/data">Data Explorer</NavLink>
          <AccountMenu />
        </nav>
      </header>

      <main>{children}</main>
    </div>
  )
}

interface NavLinkProps extends PropsWithChildren {
  href: string
}

function NavLink({children, href}: NavLinkProps) {
  return (
    <EnhancedActiveLink
      href={href}
      className="btn btn-ghost btn-sm link-exact-active:text-green">
      {children}
    </EnhancedActiveLink>
  )
}
