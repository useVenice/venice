'use client'

import {EffectContainer} from '@usevenice/ui'

import {useRouterPlus} from '../contexts/atoms'
import {LoadingIndicatorOverlay} from './loading-indicators'
import {useRouter} from 'next/navigation'
import {useEffect} from 'react'

export function RedirectTo(props: {url: string}) {
  const router = useRouterPlus()

  return (
    <EffectContainer effect={() => void router.pushPathname(props.url)}>
      <LoadingIndicatorOverlay />
    </EffectContainer>
  )
}

export function RedirectToNext13(props: {
  url: string
  children?: React.ReactNode
}) {
  const router = useRouter()
  // Only trigger once...
  useEffect(() => {
    router.push(props.url)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <>{props.children}</>
}
