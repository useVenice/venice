import {EffectContainer} from '@usevenice/ui'

import {useRouterPlus} from '../contexts/atoms'
import {useSession} from '../contexts/session-context'
import type {LayoutProps} from './Layout'
import {Layout} from './Layout'
import {LoadingIndicatorOverlay} from './loading-indicators'

export function PageContainer({
  requiresAuthentication = true,
  links,
  ...props
}: LayoutProps) {
  // TODO: How do know if Auth.useUser is actually just loading?
  const [session] = useSession()

  if (
    requiresAuthentication !== undefined &&
    session !== undefined &&
    !!session !== requiresAuthentication
  ) {
    return <RedirectTo url={requiresAuthentication ? '/auth' : '/'} />
  }
  return (
    <Layout
      requiresAuthentication={requiresAuthentication}
      links={[
        ...(links ?? []),
        ...(session
          ? [
              {label: 'Pipelines', href: '/pipelines'},
              {label: 'Data Explorer', href: '/data'},
              {label: 'Profile', href: '/profile'},
            ]
          : []),
      ]}
      {...props}
    />
  )
}

export function RedirectTo(props: {url: string}) {
  const router = useRouterPlus()

  return (
    <EffectContainer effect={() => void router.pushPathname(props.url)}>
      <LoadingIndicatorOverlay />
    </EffectContainer>
  )
}
