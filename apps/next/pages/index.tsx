import {useRouter} from 'next/router'
import React from 'react'

import {useIsAdmin} from '../contexts/PortalParamsContext'

export default function HomeScreen() {
  const router = useRouter()
  const isAdmin = useIsAdmin()
  React.useEffect(() => {
    if (isAdmin) {
      void router.replace('/ledgers')
    } else {
      void router.replace('/ledgers/default')
    }
  }, [isAdmin, router])
  return null
}
