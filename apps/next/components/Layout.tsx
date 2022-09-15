import {useAtom} from 'jotai'
import Link from 'next/link'
import {List} from 'phosphor-react'
import {twMerge} from 'tailwind-merge'

import {useLedgerSyncAdmin} from '@ledger-sync/engine-frontend'

import {developerModeAtom} from '../contexts/PortalParamsContext'
import {ActiveLink} from './ActiveLink'
import {Container} from './Container'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './DropdownMenu'

export interface LinkInput {
  label: string
  href: string
  primary?: boolean
  /** i.e. not collapsing into the menu on small screen size */
  fixed?: boolean
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
  const [developerMode, setDeveloperMode] = useAtom(developerModeAtom)
  const {adminSyncMeta, isAdmin} = useLedgerSyncAdmin({})
  return (
    <div className="relative flex h-screen flex-col overflow-y-hidden">
      <header className="border-b border-gray-100">
        {/* TODO: Add global control for envName as well as currentUserId in developer mode */}
        <Container className="h-16 flex-row items-center justify-between py-0">
          <Link
            href="/"
            className="btn btn-ghost -mx-4 truncate text-xl font-bold text-primary">
            {title}
          </Link>

          {links.length > 0 && (
            <div className="flex shrink-0 grow items-center justify-end">
              <nav className="flex space-x-2 text-sm font-medium md:space-x-4">
                {links.map((l) => (
                  <ActiveLink
                    key={l.href}
                    href={l.href}
                    className={twMerge(
                      'btn btn-sm',
                      l.primary ? 'btn-primary' : 'btn-ghost',
                      !l.fixed && 'hidden md:inline-flex',
                    )}
                    activeClassName={l.primary ? 'btn-disabled' : 'text-black'}>
                    {l.label}
                  </ActiveLink>
                ))}

                <DropdownMenu>
                  <DropdownMenuTrigger className="btn btn-ghost btn-sm btn-circle text-lg md:hidden">
                    <List />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-screen">
                    {links
                      .filter((l) => !l.fixed)
                      .map((l) => (
                        <DropdownMenuItem key={l.href} asChild>
                          <ActiveLink
                            href={l.href}
                            className={twMerge(
                              'btn no-animation justify-start',
                              l.primary ? 'btn-primary' : 'btn-ghost',
                            )}
                            activeClassName={
                              l.primary ? 'btn-disabled' : 'text-black'
                            }>
                            {l.label}
                          </ActiveLink>
                        </DropdownMenuItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </nav>
            </div>
          )}
        </Container>
      </header>

      {children}

      {isAdmin && (
        <footer className="flex flex-col space-y-4 border-t border-gray-100 p-8 lg:flex-row lg:items-center lg:justify-between lg:space-x-4 lg:space-y-0">
          <div className="form-control">
            <label className="label cursor-pointer">
              <input
                type="checkbox"
                checked={developerMode}
                onChange={(event) =>
                  setDeveloperMode(event.currentTarget.checked)
                }
                className="toggle-primary toggle"
              />
              <span className="label-text pl-2">
                Developer mode: {developerMode ? 'ON' : 'OFF'}
              </span>
            </label>
          </div>

          <div className="flex">
            <button
              className="btn-outline btn btn-sm truncate"
              onClick={() =>
                adminSyncMeta
                  .mutateAsync()
                  .then((res) => {
                    console.log('meta sync success', res)
                  })
                  .catch((err) => {
                    console.error('meta sync error', err)
                  })
              }>
              Sync metadata (reindex institutions)
            </button>
          </div>
        </footer>
      )}
    </div>
  )
}
