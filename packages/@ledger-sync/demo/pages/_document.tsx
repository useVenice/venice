import {Head, Html, Main, NextScript} from 'next/document'
import {getCssText} from '../client'

export default function Document() {
  return (
    <Html>
      <Head>
        <style id="stitches" dangerouslySetInnerHTML={{__html: getCssText()}} />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
