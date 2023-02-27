import {
  ArrowLeftRightIcon,
  CodeIcon,
  DocsIcon,
  SearchIcon,
  IntegrationsIcon,
  ProfileIcon,
  SupportIcon,
} from '@usevenice/ui/icons'
import Image from 'next/image'
import Link from 'next/link'
import {NavLink} from './NavLink'

const mainNavigation = [
  {
    name: 'Connections',
    href: '/connections',
    icon: ArrowLeftRightIcon,
  },
  {name: 'Explore Data', href: '/explore-data', icon: SearchIcon},
  {
    name: 'API Access',
    href: '/api-access',
    icon: CodeIcon,
  },
  {
    name: 'Integrations',
    href: '/integrations',
    icon: IntegrationsIcon,
  },
]

const helpNavigation = [
  {
    name: 'Support',
    href: 'https://docs.venice.is/support/contact-us',
    external: true,
    icon: SupportIcon,
  },
  {
    name: 'Documentation',
    href: 'https://docs.venice.is',
    external: true,
    icon: DocsIcon,
  },
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

      <footer className="shrink-0 py-6">
        <NavLink name="Account" href="/account" icon={ProfileIcon} />
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
