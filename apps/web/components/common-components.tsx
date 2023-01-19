import {EffectContainer, Loading} from '@usevenice/ui'

import {useRouterPlus} from '../contexts/atoms'
import {useSession} from '../contexts/session-context'
import type {LayoutProps} from './Layout'
import {Layout} from './Layout'

export function PageContainer({
  authenticated = true,
  links,
  ...props
}: LayoutProps & {authenticated?: boolean}) {
  // TODO: How do know if Auth.useUser is actually just loading?
  const [session] = useSession()

  if (
    authenticated !== undefined &&
    session !== undefined &&
    !!session !== authenticated
  ) {
    return <RedirectTo url={authenticated ? '/auth' : '/'} />
  }
  return (
    <Layout
      authenticated={authenticated}
      links={[
        ...(links ?? []),
        ...(session
          ? [
              {label: 'Pipelines', href: '/pipelines'},
              {label: 'Data explorer', href: '/data'},
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
      <Loading />
    </EffectContainer>
  )
}
