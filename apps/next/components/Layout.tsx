import Link from 'next/link'
import {twMerge} from 'tailwind-merge'

import {useLedgerSyncAdmin} from '@ledger-sync/engine-frontend'

import {useDeveloperMode, useIsAdmin} from '../contexts/PortalParamsContext'
import {ActiveLink} from './ActiveLink'
import {Container} from './Container'

export interface LinkInput {
  label: string
  href: string
  primary?: boolean
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
  const isAdmin = useIsAdmin()
  const [developerMode, setDeveloperMode] = useDeveloperMode()
  const {adminSyncMeta} = useLedgerSyncAdmin({})
  return (
    <div className="relative flex h-screen flex-col overflow-y-hidden">
      <header className="border-b border-gray-100">
        {/* TODO: Add global control for envName as well as currentUserId in developer mode */}
        <Container className="h-16 flex-row items-center justify-between py-0">
          <Link href="/">
            <a className="truncate text-xl font-bold text-primary">{title}</a>
          </Link>

          {links.length > 0 && (
            <div className="flex shrink-0 grow items-center justify-end">
              <nav className="flex space-x-2 text-sm font-medium md:space-x-4">
                {links.map((l) => (
                  <ActiveLink
                    key={l.href}
                    href={l.href}
                    activeClassName={l.primary ? 'underline' : 'text-primary'}>
                    <a
                      className={twMerge(
                        'btn btn-sm',
                        l.primary ? 'btn-primary' : 'btn-ghost',
                      )}>
                      {l.label}
                    </a>
                  </ActiveLink>
                ))}
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
