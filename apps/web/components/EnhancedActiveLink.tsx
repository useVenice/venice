import type {LinkProps} from 'next/link'
import {useRouter} from 'next/router'
import React from 'react'

import {EnhancedLink} from './EnhancedLink'

export const EnhancedActiveLink = React.forwardRef(function ActiveLink(
  props: LinkProps &
    React.ComponentPropsWithoutRef<'a'> & {
      href: string
      as?: string
      children?: React.ReactNode
    },
  forwardedRef: React.ForwardedRef<HTMLAnchorElement>,
) {
  const router = useRouter()
  const active = router.asPath.startsWith(props.as ?? props.href)
  const exactActive = (props.as ?? props.href) === router.pathname
  return (
    <EnhancedLink
      {...props}
      ref={forwardedRef}
      data-link-active={active || undefined}
      data-link-exact-active={exactActive || undefined}
    />
  )
})
