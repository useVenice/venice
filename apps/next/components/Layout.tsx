import {ActiveLink} from './ActiveLink'
import Link from 'next/link'
import React from 'react'

export interface LinkInput {
  label: string
  href: string
}

export interface LayoutProps {
  title?: string
  links?: LinkInput[]
  children: React.ReactNode
}

export function Layout({
  title = 'LedgerSync',
  links = [],
  children,
}: LayoutProps) {
  return (
    <div className="relative flex h-screen flex-col overflow-y-hidden">
      <header className="border-b border-gray-100">
        <div className="mx-auto flex h-16 w-full max-w-screen-2xl items-center justify-between px-4 md:px-8">
          <Link href="/">
            <a className="rounded-lg bg-gray-100 p-2 text-primary">
              <span className="text-lg font-bold sm:text-xl">{title}</span>
            </a>
          </Link>

          {links.length > 0 && (
            <div className="flex flex-1 items-center justify-end">
              <nav className="flex space-x-6 text-sm font-medium">
                {links.map((l) => (
                  <ActiveLink
                    key={l.href}
                    href={l.href}
                    activeClassName="text-primary">
                    <a className="h-16 leading-[4rem] hover:text-primary">
                      {l.label}
                    </a>
                  </ActiveLink>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      {children}
    </div>
  )
}
