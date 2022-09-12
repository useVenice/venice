import Link from 'next/link'
import {useRouter} from 'next/router'
import {useState} from 'react'
import {twMerge} from 'tailwind-merge'
import type {Id} from '@ledger-sync/cdk-core'
import {useLedgerSync} from '@ledger-sync/engine-frontend'
import {ActiveLink} from './ActiveLink'

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
  // TODO: Sync ledgerId and currentEnv into the url
  const router = useRouter()
  const {ledgerId} = router.query as {ledgerId: Id['ldgr']}
  const [developerMode, setDeveloperMode] = useState(false)
  const {syncMeta} = useLedgerSync({ledgerId, envName: 'sandbox'})
  return (
    <div className="relative flex h-screen flex-col overflow-y-hidden">
      <header className="border-b border-gray-100">
        {/* TODO: Add global control for envName as well as currentUserId */}
        <div className="mx-auto flex h-16 w-full max-w-screen-2xl items-center justify-between px-4 md:px-8">
          <Link href="/">
            <a className="rounded-lg bg-gray-100 p-2 text-primary">
              <span className="text-xs font-bold sm:text-xl">{title}</span>
            </a>
          </Link>

          {links.length > 0 && (
            <div className="flex flex-1 items-center justify-end">
              <nav className="flex space-x-6 text-sm font-medium">
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
        </div>
      </header>

      {children}

      <footer className="flex border-t border-gray-100 p-8">
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

        <div className="flex flex-1 justify-end">
          <button
            className="btn-outline btn btn-sm"
            onClick={() => {
              syncMeta
                .mutateAsync([undefined])
                .then((res) => {
                  console.log('meta sync success', res)
                })
                .catch((err) => {
                  console.error('meta sync error', err)
                })
            }}>
            Sync metadata (reindex institutions)
          </button>
        </div>
      </footer>
    </div>
  )
}
