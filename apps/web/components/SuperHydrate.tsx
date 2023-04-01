'use client'

import {Hydrate} from '@tanstack/react-query'
import React from 'react'
import superjson from 'superjson'
import type {SuperJSONResult} from 'superjson/dist/types'

/** Hydrate using superjson */
export function SuperHydrate(props: {
  dehydratedState?: SuperJSONResult
  children: React.ReactNode
}) {
  return (
    <Hydrate
      state={
        props.dehydratedState && superjson.deserialize(props.dehydratedState)
      }>
      {props.children}
    </Hydrate>
  )
}
