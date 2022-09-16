import type {LinkProps} from 'next/link'
import Link from 'next/link'
import React from 'react'

import type {Merge} from '@ledger-sync/util'
import {parseQueryParams, stringifyQueryParams} from '@ledger-sync/util'

export interface ActiveLinkProps
  extends Merge<React.ComponentPropsWithoutRef<'a'>, LinkProps> {
  activeClassName?: string
}

export const ActiveLink = React.forwardRef(function ActiveLink(
  {className: classNameProp, activeClassName, ...restProps}: ActiveLinkProps,
  forwardedRef: React.ForwardedRef<HTMLAnchorElement>,
) {
  // const router = useRouter()
  const [className, _setClassName] = React.useState(classNameProp)

  const url = new URL(
    (restProps.as ?? restProps.href) as string,
    typeof window != 'undefined' ? window.location.href : 'http://noop/',
  )
  const pathname = url.pathname

  // Preserve query shall be the default behavior...
  const query = stringifyQueryParams({
    // We do not use router.query here because it contains pathQuery as well as searchQuery
    ...parseQueryParams(
      typeof window !== 'undefined' ? window.location.search : '',
    ), // Sort order...
    ...parseQueryParams(url.search),
  })

  // This doesn't work so well anymore now that we use the same pathname...
  // React.useEffect(() => {
  //   // Check if the router fields are updated client-side
  //   if (router.isReady) {
  //     // Dynamic route will be matched via props.as
  //     // Static route will be matched via props.href

  //     // Using URL().pathname to get rid of query and hash
  //     const activePathname = new URL(router.asPath, window.location.href)
  //       .pathname
  //     const newClassName =
  //       pathname === activePathname
  //         ? twMerge(classNameProp, activeClassName)
  //         : classNameProp
  //     setClassName(newClassName)
  //   }
  // }, [activeClassName, classNameProp, pathname, router.asPath, router.isReady])

  return (
    <Link
      ref={forwardedRef}
      className={className}
      {...restProps}
      href={{pathname, query}}
    />
  )
})
