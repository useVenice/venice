import clsx from 'clsx'
import NextLink from 'next/link'
import {useRouter} from 'next/router'
import type {ComponentPropsWithoutRef, ComponentType} from 'react'

import type {SvgIconProps} from '../../../components/icons'

interface NavLinkProps {
  name: string
  href: string
  external?: boolean
  icon: ComponentType<SvgIconProps>
}

export function NavLink({name, href, external, icon: Icon}: NavLinkProps) {
  const router = useRouter()
  const current = router.pathname === href
  const Link = external ? ExternalLink : NextLink
  return (
    <div key={name} className="relative px-4">
      <Link
        href={href}
        className={clsx(
          current
            ? 'bg-venice-black/75 text-offwhite hover:opacity-90'
            : 'text-venice-gray hover:text-offwhite',
          'flex items-center rounded-lg px-2 py-2 text-sm',
        )}>
        <Icon
          className="mr-3 h-6 w-6 shrink-0 fill-current"
          aria-hidden="true"
        />
        {name}
      </Link>
      {current && (
        <i className="absolute inset-y-0 right-0 w-1 rounded-l bg-green" />
      )}
    </div>
  )
}

function ExternalLink(props: ComponentPropsWithoutRef<'a'>) {
  return <a {...props} target="_blank" rel="noopener noreferrer" />
}
