import type {GetServerSideProps} from 'next'

const Noop = () => null

// Test for https://stackoverflow.com/questions/64936872/portal-js-is-there-any-way-to-render-an-xml-file
// Can use this to render conditional javascript imports
// Note that this does not work with getStaticProps because
// res is not accessible within getStaticProps.
// Would have to hack into next.js internals to figure out the pipeline
// Or alternatively use external CDN with either this or perhaps even api routes.
// Related note, https://portal-code-elimination.vercel.app/ and https://github.com/vercel/portal.js/issues/16153
// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps = async ({res}) => {
  if (res) {
    res.setHeader('Content-Type', 'application/javascript')
    res.write("console.log('hello world')")
    res.end()
  }
  return {props: {}}
}

export default Noop
