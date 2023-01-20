import {useAtom} from 'jotai'
import {List} from 'phosphor-react'
import {twMerge} from 'tailwind-merge'
import Image from 'next/image'
import Head from 'next/head'

import {useVeniceAdmin} from '@usevenice/engine-frontend'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@usevenice/ui'
import {Container} from '@usevenice/ui/components/Container'

import {developerModeAtom} from '../contexts/atoms'
import {EnhancedActiveLink} from './EnhancedActiveLink'

export interface LinkInput {
  label: string
  href: string
  primary?: boolean
  /** i.e. not collapsing into the menu on small screen size */
  fixed?: boolean
}

export interface LayoutProps {
  requiresAuthentication?: Boolean
  title?: string
  links?: LinkInput[]
  children: React.ReactNode
  flex?: boolean
}

export function Layout({
  requiresAuthentication,
  title = 'Venice - Financial data, fast.',
  links = [],
  children,
  ...props
}: LayoutProps) {
  const [developerMode, setDeveloperMode] = useAtom(developerModeAtom)
  const {adminSyncMeta, isAdmin, integrationsRes} = useVeniceAdmin({})
  // TODO: deduplicate me...
  const onlyIntegrationId =
    integrationsRes.data?.length === 1 ? integrationsRes.data[0]?.id : undefined
  return (
    <>
      <Head>
        <title>Venice - {title}</title>
      </Head>
      <div className="relative mx-auto flex h-screen max-w-screen-xl flex-col overflow-y-hidden">
        <header className="shrink-0 overflow-x-hidden">
          {/* TODO: Add global control for envName as well as currentUserId in developer mode */}
          <Container className="mt-4 h-16 flex-row items-center justify-between py-0">
            {requiresAuthentication && (
              <EnhancedActiveLink href="/">
                <Image
                  src="/venice-logo.svg"
                  alt="Venice Logo"
                  width={102}
                  height={32}
                />
              </EnhancedActiveLink>
            )}

            {links.length > 0 && (
              <div className="flex shrink-0 grow items-center justify-end">
                <nav className="flex space-x-2 text-sm font-medium md:space-x-4">
                  {links.map((l) => (
                    <EnhancedActiveLink
                      key={l.href}
                      href={l.href}
                      className="btn btn-ghost btn-sm link-exact-active:text-green">
                      {l.label}
                    </EnhancedActiveLink>
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
                            <EnhancedActiveLink
                              href={l.href}
                              className={twMerge(
                                'btn no-animation justify-start',
                                l.primary
                                  ? 'btn-primary link-exact-active:btn-disabled'
                                  : 'btn-ghost link-exact-active:text-black',
                              )}>
                              {l.label}
                            </EnhancedActiveLink>
                          </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </nav>
              </div>
            )}
          </Container>
        </header>

        <div
          className={twMerge(
            'flex-1 overflow-y-scroll',
            props.flex && 'flex flex-col',
          )}>
          {children}
        </div>

        {isAdmin && (
          <footer className="flex flex-col space-y-4 border-t p-8 lg:flex-row lg:items-center lg:justify-between lg:space-x-4 lg:space-y-0">
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

            {!onlyIntegrationId && (
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
            )}
          </footer>
        )}
      </div>
    </>
  )
}
