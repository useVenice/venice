import './global.css'

export const metadata = {
  title: 'Venice — Financial data, fast.',
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
