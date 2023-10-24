'use client'

import React from 'react'

import type {FrameMessage} from '@usevenice/connect/common'

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
