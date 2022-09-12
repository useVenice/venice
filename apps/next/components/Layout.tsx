import Link from 'next/link'
import {useRouter} from 'next/router'
import {useState} from 'react'
import type {Id} from '@ledger-sync/cdk-core'
import {useLedgerSync} from '@ledger-sync/engine-frontend'
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
  // TODO: Sync ledgerId and currentEnv into the url
  const router = useRouter()
  const {ledgerId} = router.query as {ledgerId: Id['ldgr']}

  // Turn Developer Mode ON/OFF
  const [enabled, setEnabled] = useState(false)

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

      <footer className="flex justify-between border-t border-gray-100 p-8">
        <div className="relative flex flex-col items-center justify-center">
          <div className="flex">
            <label className="relative mr-5 inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={enabled}
                readOnly
              />
              <div
                onClick={() => {
                  setEnabled(!enabled)
                }}
                className="peer h-6 w-11 rounded-full bg-gray-200  after:absolute  after:top-0.5 after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-green-300"></div>
              <span className="ml-2 text-sm font-medium text-gray-900">
                Developer Mode: {enabled ? 'ON' : 'OFF'}
              </span>
            </label>
          </div>
        </div>
        <button
          className="btn-outline btn"
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
      </footer>
    </div>
  )
}
