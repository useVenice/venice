import './global.css'

import {env} from '@usevenice/app-config/env'

export const metadata = {
  title: `${
    env.VERCEL_ENV === 'production' ? '' : `[${env.VERCEL_ENV}] `
  }Venice — Financial data, fast.`,
  icons: [{url: '/favicon.svg', type: 'image/svg+xml'}],
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <head></head>
      <body>{children}</body>
    </html>
  )
}
