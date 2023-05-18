import './global.css'

import NextTopLoader from 'nextjs-toploader'

export const metadata = {
  title: 'Gondola, your financial DB',
  // icons: [{url: '/favicon.svg', type: 'image/svg+xml'}],
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <head></head>
      <body>
        <NextTopLoader showSpinner={false} />
        {children}
      </body>
    </html>
  )
}
