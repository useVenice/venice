import Link from 'next/link'

import {cn} from '@/lib/utils'

const links: Array<{href: string; title: string}> = [
  {
    title: 'Magic Link',
    href: '/magic-link',
  },
  {
    title: 'End users',
    href: '/end-users',
  },
  {
    title: 'Integrations',
    href: '/integrations',
  },
  {
    title: 'Resources',
    href: '/resources',
  },
  {
    title: 'Pipelines',
    href: '/pipelines',
  },
]

export function TopLav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn('flex items-center space-x-4 lg:space-x-6', className)}
      {...props}>
      {links.map((link, i) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            'hover:text-primary text-sm font-medium transition-colors',
            i === 0 && 'text-muted-foreground',
          )}>
          {link.title}
        </Link>
      ))}
    </nav>
  )
}
