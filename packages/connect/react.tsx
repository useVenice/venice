import React from 'react'
import type {GetIFrameProps} from './common'
import {getIFrameUrl} from './common'

export interface VeniceConnectEmbedProps
  extends GetIFrameProps,
    React.IframeHTMLAttributes<HTMLIFrameElement> {
  onReady?: () => void
}

export const VeniceConnectEmbed = React.forwardRef(
  (
    {deploymentUrl, params, onReady, ...iframeProps}: VeniceConnectEmbedProps,
    forwardedRef: React.ForwardedRef<HTMLIFrameElement>,
  ) => {
    const url = getIFrameUrl({deploymentUrl, params})
    const [loading, setLoading] = React.useState(true)

    // Add a more reliable way to know iframe has fully finished loading
    // by sending message from iframe to parent when ready
    return (
      <>
        {loading && <span>Loading iframe...</span>}
        <iframe
          {...iframeProps}
          ref={forwardedRef}
          onLoad={() => {
            setLoading(false)
            onReady?.()
          }}
          src={url}
        />
      </>
    )
  },
)
VeniceConnectEmbed.displayName = 'VeniceConnectEmbed'
