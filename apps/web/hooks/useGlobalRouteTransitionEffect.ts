import {useRouter} from 'next/router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {useEffect} from 'react'

/**
 * DOES NOT work in next.js 13 app dir
 * @see https://github.com/vercel/next.js/discussions/41934
 * Will have a use a wrapper around next.js 13 Link
 * https://github.com/vercel/next.js/discussions/42016
 */
export function useGlobalRouteTransitionEffect(): void {
  const router = useRouter()
  useEffect(() => {
    NProgress.configure({
      showSpinner: false,
      template:
        // ngprogress styles have strong specificity so we can't customize
        // it with tailwind classes
        "<div class='bar' role='bar' style='background: #12b886;'></div>",
    })

    const handleRouteStart = () => NProgress.start()
    const handleRouteDone = () => NProgress.done()

    router.events.on('routeChangeStart', handleRouteStart)
    router.events.on('routeChangeComplete', handleRouteDone)
    router.events.on('routeChangeError', handleRouteDone)

    return () => {
      router.events.off('routeChangeStart', handleRouteStart)
      router.events.off('routeChangeComplete', handleRouteDone)
      router.events.off('routeChangeError', handleRouteDone)
    }
  }, [router.events])
}
