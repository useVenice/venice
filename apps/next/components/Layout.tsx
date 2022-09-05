import {ActiveLink} from './ActiveLink'
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
        <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between sm:px-6 lg:px-8">
          <a className="rounded-lg bg-gray-100 p-2" href="/">
            <span className="text-lg font-bold sm:text-xl">{title}</span>
          </a>

          {links.length > 0 && (
            <div className="flex flex-1 items-center justify-end">
              <nav className="flex space-x-6 text-sm font-medium text-gray-500">
                {links.map((l) => (
                  <ActiveLink
                    key={l.href}
                    href={l.href}
                    activeClassName="text-primary">
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
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
