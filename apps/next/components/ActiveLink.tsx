import type {LinkProps} from 'next/link'
import Link from 'next/link'
import {useRouter} from 'next/router'
import React from 'react'
import {twMerge} from 'tailwind-merge'

export interface ActiveLinkProps extends LinkProps {
  children: React.ReactElement
  activeClassName: string
}

export function ActiveLink({
  children,
  activeClassName,
  ...restProps
}: ActiveLinkProps) {
  const {asPath, isReady} = useRouter()

  const child = React.Children.only(children)
  const childClassName = child.props.className ?? ''
  const [className, setClassName] = React.useState(childClassName)

  React.useEffect(() => {
    // Check if the router fields are updated client-side
    if (isReady) {
      // Dynamic route will be matched via props.as
      // Static route will be matched via props.href
      const linkPathname = new URL(
        (restProps.as ?? restProps.href) as string,
        window.location.href,
      ).pathname

      // Using URL().pathname to get rid of query and hash
      const activePathname = new URL(asPath, window.location.href).pathname

      const newClassName =
        linkPathname === activePathname
          ? twMerge(childClassName, activeClassName)
          : childClassName

      if (newClassName !== className) {
        setClassName(newClassName)
      }
    }
  }, [
    asPath,
    isReady,
    restProps.as,
    restProps.href,
    childClassName,
    activeClassName,
    setClassName,
    className,
  ])

  return (
    <Link {...restProps}>
      {React.cloneElement(child, {
        className: className ?? null,
      })}
    </Link>
  )
}
