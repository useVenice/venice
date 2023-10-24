'use client'

import React from 'react'

export function CallbackPage(props: {res: any; autoClose?: boolean}) {
  React.useEffect(() => {
    if (props.autoClose) {
      setTimeout(() => {
        window.close()
      }, 300)
    }
  }, [])
  return (
    <div>
      <pre>{JSON.stringify(props.res, null, 4)}</pre>
      You may now close this window if it does not automatically close
      <button onClick={() => window.close()}>Close</button>
    </div>
  )
}
