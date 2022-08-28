import React from 'react'
import {tw} from 'twind'
import {ActiveLink} from './ActiveLink'

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
    <div className={tw`flex flex-col relative h-screen overflow-y-hidden`}>
      <header className={tw`border-b border-gray-100`}>
        <div
          className={tw`flex items-center justify-between h-16 mx-auto max-w-screen-2xl sm:px-6 lg:px-8`}>
          <a className={tw`p-2 bg-gray-100 rounded-lg`} href="/">
            <span className={tw`text-lg font-bold sm:text-xl`}>{title}</span>
          </a>

          {links.length > 0 && (
            <div className={tw`flex items-center justify-end flex-1`}>
              <nav
                className={tw`flex text-gray-500 font-medium text-sm space-x-6`}>
                {links.map((l) => (
                  <ActiveLink
                    key={l.href}
                    href={l.href}
                    activeClassName={tw`override:(text-primary border-current)`}>
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a
                      className={tw`h-16 leading-[4rem] border-b-4 border-transparent hover:text-primary hover:border-current`}>
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
