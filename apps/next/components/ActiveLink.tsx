import type {LinkProps} from 'next/link'
import Link from 'next/link'
import {useRouter} from 'next/router'
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
  const router = useRouter()
  const [className, setClassName] = React.useState(classNameProp)

  const url = new URL(
    (restProps.as ?? restProps.href) as string,
    window.location.href,
  )
  const pathname = url.pathname
  // Preserve query shall be the default behavior...
  const query = stringifyQueryParams({
    ...parseQueryParams(url.search), // Sort order...
    ...router.query,
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
  // const href =
  //   typeof restProps.href === 'string' ? R.pipe(restProps.href, href => ) : restProps.href
  return (
    <Link
      ref={forwardedRef}
      className={className}
      {...restProps}
      href={{pathname, query}}
    />
  )
})
