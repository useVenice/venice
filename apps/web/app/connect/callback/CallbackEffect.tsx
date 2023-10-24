'use client'

import React from 'react'

import {zId} from '@usevenice/cdk-core'
import {z} from '@usevenice/util'

export const zFrameMessage = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('SUCCESS'),
    data: z.object({resourceId: zId('reso')}),
  }),
  z.object({
    type: z.literal('ERROR'),
    data: z.object({code: z.string(), message: z.string()}),
  }),
])

export type FrameMessage = z.infer<typeof zFrameMessage>

export function CallbackEffect(props: {
  msg: FrameMessage
  autoClose?: boolean
}) {
  React.useEffect(() => {
    const opener = window.opener as Window | null
    opener?.postMessage(props.msg, '*')

    if (props.autoClose) {
      setTimeout(() => {
        window.close()
      }, 300)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
