import Image from 'next/image'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {__DEBUG__} from '@usevenice/app-config/constants'
import type {IconName} from '@usevenice/ui'
import {Button, Icon, ScrollArea} from '@usevenice/ui'
import {R} from '@usevenice/util'
import {cn} from '@/lib-client/ui-utils'

type TypedHref = Extract<React.ComponentProps<typeof Link>['href'], string>
interface LinkItem {
  href: TypedHref
  title: string
  icon?: IconName
}

const sectionedLinks: Array<{
  title?: string
  items: LinkItem[]
}> = [
  {
    items: R.compact<LinkItem>([
      // {
      //   title: 'Home',
      //   href: '/',
      //   icon: 'Home',
      // },
      {
        title: 'Magic Link',
        href: '/magic-link',
        icon: 'Wand',
      },
      __DEBUG__ && {
        title: 'Metrics',
        href: '/metrics',
        icon: 'BarChart2',
      },
    ]),
  },
  {
    title: 'Entities',
    items: [
      {
        title: 'End users',
        href: '/end-users',
        icon: 'Users',
      },
      {
        title: 'Pipelines',
        href: '/pipelines',
        icon: 'ArrowLeftRight',
      },
      {
        title: 'Resources',
        href: '/resources',
        icon: 'Box',
      },
      {
        title: 'Connector Configs',
        href: '/connector-configs',
        icon: 'Layers',
      },
    ],
  },
  {
    title: 'Developers',
    items: [
      // {
      //   title: 'Logs',
      //   href: '/logs',
      //   icon: 'Footprints',
      // },
      {
        title: 'API',
        href: '/api-access',
        icon: 'Key',
      },
      // Nothing interesting in here anymore
      // {
      //   title: 'Settings',
      //   href: '/settings',
      //   icon: 'Settings',
      // },
    ],
  },
]

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({className}: SidebarProps) {
  const pathname = usePathname()
  return (
    <nav className={cn('flex flex-col', className)}>
      <ScrollArea className="h-full px-2">
        <div className="space-y-4 py-4">
          {sectionedLinks.map((section, i) => (
            <div key={section.title ?? `i-${i}`} className="px-4 py-2">
              <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
                {section.title}
              </h2>
              <div className="space-y-1">
                {section.items.map((link) => (
                  <Link href={link.href} key={link.href}>
                    <Button
                      variant={
                        pathname === link.href ||
                        pathname?.startsWith(link.href + '/')
                          ? 'outline'
                          : 'ghost'
                      }
                      size="sm"
                      className="w-full justify-start">
                      {link.icon && (
                        <Icon name={link.icon} className="mr-2 h-4 w-4" />
                      )}
                      {link.title}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="mt-auto p-4">
        <Link className="hover:opacity-90" href="/">
          <Image
            width={102}
            height={32}
            src="/venice-logo-black.svg"
            alt="Venice"
          />
        </Link>
      </div>
    </nav>
  )
}
