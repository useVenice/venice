import type {LinkProps} from 'next/link'
import Link from 'next/link'
import {useRouter} from 'next/router'
import React from 'react'
import {twMerge} from 'tailwind-merge'

import type {Merge} from '@ledger-sync/util'

export interface ActiveLinkProps
  extends Merge<React.ComponentPropsWithoutRef<'a'>, LinkProps> {
  activeClassName: string
}

export const ActiveLink = React.forwardRef(function ActiveLink(
  {className: classNameProp, activeClassName, ...restProps}: ActiveLinkProps,
  forwardedRef: React.ForwardedRef<HTMLAnchorElement>,
) {
  const router = useRouter()
  const [className, setClassName] = React.useState(classNameProp)
  React.useEffect(() => {
    // Check if the router fields are updated client-side
    if (router.isReady) {
      // Dynamic route will be matched via props.as
      // Static route will be matched via props.href
      const linkPathname = new URL(
        (restProps.as ?? restProps.href) as string,
        window.location.href,
      ).pathname
      // Using URL().pathname to get rid of query and hash
      const activePathname = new URL(router.asPath, window.location.href)
        .pathname
      const newClassName =
        linkPathname === activePathname
          ? twMerge(classNameProp, activeClassName)
          : classNameProp
      setClassName(newClassName)
    }
  }, [
    activeClassName,
    classNameProp,
    restProps.as,
    restProps.href,
    router.asPath,
    router.isReady,
  ])
  return <Link ref={forwardedRef} className={className} {...restProps} />
})
