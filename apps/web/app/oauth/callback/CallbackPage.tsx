'use client'

import React from 'react'

import {z} from '@usevenice/util'

import {zId} from '@/../../packages/cdk-core'

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

export function CallbackPage(props: {msg: FrameMessage; autoClose?: boolean}) {
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
  return (
    <div>
      <pre>{JSON.stringify(props.msg, null, 4)}</pre>
      You may now close this window if it does not automatically close
      <button onClick={() => window.close()}>Close</button>
    </div>
  )
}
