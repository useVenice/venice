import {useAtom} from 'jotai'
import {List} from 'phosphor-react'
import {twMerge} from 'tailwind-merge'

import {useVeniceAdmin} from '@usevenice/engine-frontend'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@usevenice/ui'
import {Container} from '@usevenice/ui/components/Container'

import {developerModeAtom} from '../contexts/atoms'
import {ActiveLink} from './ActiveLink'

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

export function Layout({title = 'Venice', links = [], children}: LayoutProps) {
  const [developerMode, setDeveloperMode] = useAtom(developerModeAtom)
  const {adminSyncMeta, isAdmin, integrationsRes} = useVeniceAdmin({})
  // TODO: deduplicate me...
  const onlyIntegrationId =
    integrationsRes.data?.length === 1 ? integrationsRes.data[0]?.id : undefined

  return (
    <div className="relative flex h-screen flex-col overflow-y-hidden">
      <header className="overflow-x-hidden border-b border-gray-100">
        {/* TODO: Add global control for envName as well as currentUserId in developer mode */}
        <Container className="h-16 flex-row items-center justify-between py-0">
          <ActiveLink
            href="/"
            className="shrink-1 truncate text-xl font-bold text-primary">
            {title}
          </ActiveLink>

          {links.length > 0 && (
            <div className="flex shrink-0 grow items-center justify-end">
              <nav className="flex space-x-2 text-sm font-medium md:space-x-4">
                {links.map((l) => (
                  <ActiveLink
                    key={l.href}
                    href={l.href}
                    className={twMerge(
                      'btn btn-sm',
                      l.primary
                        ? 'btn-primary link-exact-active:btn-disabled'
                        : 'btn-ghost link-exact-active:text-black',
                      !l.fixed && 'hidden md:inline-flex',
                    )}>
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
                              l.primary
                                ? 'btn-primary link-exact-active:btn-disabled'
                                : 'btn-ghost link-exact-active:text-black',
                            )}>
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
  )
}
