import {useIntervalEffect} from '@react-hookz/web'
import React from 'react'

export function Loading() {
  const [count, setCount] = React.useState(0)
  useIntervalEffect(() => {
    setCount((prev) => (prev + 1) % 4)
  }, INTERVAL_MS)
  return <span className="text-xs">Loading{'.'.repeat(count)}</span>
}

const INTERVAL_MS = 500
