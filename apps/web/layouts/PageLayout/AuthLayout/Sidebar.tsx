import Image from 'next/image'
import Link from 'next/link'

import {
  ArrowLeftRightIcon,
  DatabaseIcon,
  DocsIcon,
  ExportIcon,
  ProfileIcon,
  SupportIcon,
} from '../../../components/icons'

import {NavLink} from './NavLink'

const mainNavigation = [
  {
    name: 'Connections',
    href: '/pipelines',
    icon: ArrowLeftRightIcon,
  },
  {name: 'Export Data', href: '/export', icon: ExportIcon},
  {
    name: 'API Access',
    href: '/api-access',
    icon: DatabaseIcon,
  },
]

const helpNavigation = [
  {
    name: 'Support',
    href: '/support',
    icon: SupportIcon,
  },
  {name: 'Documentation', href: '/docs', icon: DocsIcon},
]

export function Sidebar() {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-venice-black-500">
      <header className="shrink-0 p-6">
        <Link className="hover:opacity-90" href="/">
          <Image
            width={102}
            height={32}
            src="/venice-logo-white-no-bg.svg"
            alt="Venice"
          />
        </Link>
      </header>

      <SidebarMain />

      <footer className="flex shrink-0 p-6">
        <Account />
      </footer>
    </div>
  )
}

function SidebarMain() {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto py-6">
      <nav className="space-y-1">
        {mainNavigation.map((props) => (
          <NavLink key={props.name} {...props} />
        ))}
      </nav>
      <NavSectionSeparator />
      <nav className="space-y-1">
        {helpNavigation.map((props) => (
          <NavLink key={props.name} {...props} />
        ))}
      </nav>
    </div>
  )
}

function NavSectionSeparator() {
  return (
    <div className="py-6 px-4">
      <hr className="border-venice-black-300" />
    </div>
  )
}

function Account() {
  return (
    <Link
      href="/account"
      className="block shrink-0 text-venice-gray hover:text-offwhite">
      <div className="flex items-center gap-x-3">
        <div className="inline-flex h-6 w-6 fill-current">
          <ProfileIcon />
        </div>
        <div>
          <p className="text-sm">Account</p>
        </div>
      </div>
    </Link>
  )
}
