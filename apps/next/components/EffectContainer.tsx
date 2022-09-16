import {useEffect} from 'react'

export function EffectContainer({effect}: {effect: () => void}) {
  useEffect(effect, [effect])
  return null
}
