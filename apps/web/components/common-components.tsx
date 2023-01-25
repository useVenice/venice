import {EffectContainer} from '@usevenice/ui'

import {useRouterPlus} from '../contexts/atoms'
import {LoadingIndicatorOverlay} from './loading-indicators'

export function RedirectTo(props: {url: string}) {
  const router = useRouterPlus()

  return (
    <EffectContainer effect={() => void router.pushPathname(props.url)}>
      <LoadingIndicatorOverlay />
    </EffectContainer>
  )
}
