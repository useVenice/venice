import {useIntervalEffect} from '@react-hookz/web'
import React from 'react'

export function Loading() {
  const [count, setCount] = React.useState(0)
  useIntervalEffect(() => {
    setCount((prev) => (prev + 1) % 3)
  }, INTERVAL_MS)
  return <span className="text-sm">Loading{'.'.repeat(count + 1)}</span>
}

const INTERVAL_MS = 500
