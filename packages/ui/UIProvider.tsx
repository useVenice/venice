import React from 'react'

import {ToastProvider, ToastViewport} from './components'

export function UIProvider({children}: {children: React.ReactNode}) {
  return (
    <ToastProvider duration={4000}>
      {children}
      <ToastViewport />
    </ToastProvider>
  )
}
