import {useRouter} from 'next/router'
import React from 'react'

import {LSProvider} from '@ledger-sync/engine-frontend'

import {useIsAdmin} from '../contexts/PortalParamsContext'

export default function HomeScreen() {
  const router = useRouter()
  const isAdmin = useIsAdmin()
  const {ledgerId} = LSProvider.useContext()

  React.useEffect(() => {
    if (isAdmin) {
      void router.replace('/ledgers')
    } else if (ledgerId) {
      void router.replace(`/ledgers/${ledgerId}`)
    }
  }, [isAdmin, ledgerId, router])
  return !isAdmin && !ledgerId ? <div>Unauthorized</div> : null
}
