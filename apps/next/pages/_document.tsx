import {Head, Html, Main, NextScript} from 'next/document'

export default function MyDocument() {
  return (
    <Html>
      <Head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link
          rel="preload"
          href="/fonts/Inter-roman.var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Inter-italic.var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
