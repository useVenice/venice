import withTwindDocument from '@twind/next/app'
import {Head, Html, Main, NextScript} from 'next/document'
import twindConfig from '../twind.config'

function Document() {
  return (
    <Html>
      <Head />

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

export default withTwindDocument(twindConfig, Document)
