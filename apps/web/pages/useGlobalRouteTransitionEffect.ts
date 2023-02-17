import {useRouter} from 'next/router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {useEffect} from 'react'

export function useGlobalRouteTransitionEffect(): void {
  const router = useRouter()
  useEffect(() => {
    console.log('[thanik] effect re-runs')
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
