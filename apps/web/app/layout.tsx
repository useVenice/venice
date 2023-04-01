import '../pages/global.css'

/* eslint-disable @next/next/no-page-custom-font */
export const metadata = {
  title: 'Venice — Financial data, fast.',
  icons: [{url: '/favicon.svg', type: 'image/svg+xml'}],
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="bg-black text-offwhite" data-theme="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;700&display=swap"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Code+Pro&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
