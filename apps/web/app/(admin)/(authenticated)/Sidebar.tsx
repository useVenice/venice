import * as lucide from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import {usePathname} from 'next/navigation'

import {Button, ScrollArea} from '@usevenice/ui/new-components'

import {cn} from '@/lib/utils'

const sectionedLinks: Array<{
  title?: string
  items: Array<{href: string; title: string; icon?: keyof typeof lucide}>
}> = [
  {
    items: [
      {
        title: 'Home',
        href: '/',
        icon: 'Home',
      },
      {
        title: 'Magic Link',
        href: '/magic-link',
        icon: 'Wand',
      },
      {
        title: 'Metrics',
        href: '/metrics',
        icon: 'BarChart2',
      },
    ],
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
        title: 'Integrations',
        href: '/integrations',
        icon: 'Layers',
      },
    ],
  },
  {
    title: 'Developers',
    items: [
      {
        title: 'Logs',
        href: '/logs',
        icon: 'Footprints',
      },
      {
        title: 'API Keys',
        href: '/api-keys',
        icon: 'Key',
      },
      {
        title: 'Documentation',
        href: '/docs',
        icon: 'FileText',
      },
    ],
  },
]

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({className}: SidebarProps) {
  const pathname = usePathname()
  return (
    <nav className={cn('flex h-full flex-col', className)}>
      <ScrollArea className="h-full px-2">
        <div className="space-y-4 py-4">
          {sectionedLinks.map((section, i) => (
            <div key={section.title ?? `i-${i}`} className="px-4 py-2">
              <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
                {section.title}
              </h2>
              <div className="space-y-1">
                {section.items.map((link) => {
                  const Icon =
                    link.icon && (lucide[link.icon] as lucide.LucideIcon)
                  return (
                    <Link href={link.href} key={link.href}>
                      <Button
                        variant={pathname === link.href ? 'outline' : 'ghost'}
                        size="sm"
                        className="w-full justify-start">
                        {Icon && <Icon className="mr-2 h-4 w-4" />}
                        {link.title}
                      </Button>
                    </Link>
                  )
                })}
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
