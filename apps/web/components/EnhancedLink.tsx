import type {LinkProps} from 'next/link'
import Link from 'next/link'
import {useRouter} from 'next/router'
import React from 'react'

import {parseUrl, shallowOmitUndefined} from '@usevenice/util'

import {kAccessToken, kEnv} from '../contexts/atoms'

export const EnhancedLink = React.forwardRef(function EnhancedLink(
  props: LinkProps &
    React.ComponentPropsWithoutRef<'a'> & {
      href: string
      as?: string
      children?: React.ReactNode
    },
  forwardedRef: React.ForwardedRef<HTMLAnchorElement>,
) {
  const router = useRouter()
  const parsedHref = parseUrl(props.href)
  return (
    <Link
      {...props}
      ref={forwardedRef}
      href={{
        pathname: parsedHref.url,
        // Preserve whitelisted params
        query: shallowOmitUndefined({
          [kAccessToken]: router.query[kAccessToken] as string | undefined,
          [kEnv]: router.query[kEnv] as string | undefined,
          ...parsedHref.query,
        }),
      }}
    />
  )
})
