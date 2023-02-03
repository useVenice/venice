import {Head, Html, Main, NextScript} from 'next/document'

export default function VeniceDocument() {
  return (
    <Html className="bg-black text-offwhite">
      <Head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
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
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

// NOTE we do not use a custom _error.tsx because 500 errors are being rendered incorrectly
// as 404, see https://stackoverflow.com/questions/73992633/next-js-getserversideprops-throw-error-results-in-404-instead-of-500
