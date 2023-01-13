import {Auth} from '@supabase/auth-ui-react'

import {Container, EffectContainer, Loading} from '@usevenice/ui'

import {useRouterPlus} from '../contexts/atoms'
import type {LayoutProps} from './Layout'
import {Layout} from './Layout'

export function PageContainer({
  authenticated,
  ...props
}: LayoutProps & {authenticated?: boolean}) {
  const {user} = Auth.useUser()
  if (authenticated !== undefined && !!user !== authenticated) {
    return <RedirectTo url={authenticated ? '/auth' : '/'} />
  }
  return (
    <Layout
      links={
        user
          ? [
              {label: 'Pipelines', href: '/pipelines'},
              {label: 'Data explorer', href: '/data'},
              {label: 'Profile', href: '/profile'},
            ]
          : []
      }
      {...props}
    />
  )
}

export function RedirectTo(props: {url: string}) {
  const router = useRouterPlus()

  return (
    <EffectContainer effect={() => void router.pushPathname(props.url)}>
      <Layout>
        <Container className="flex-1">
          <Loading />
        </Container>
      </Layout>
    </EffectContainer>
  )
}
