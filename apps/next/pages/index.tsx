import {useRouter} from 'next/router'
import React from 'react'

import {LSProvider} from '@ledger-sync/engine-frontend'

export default function HomeScreen() {
  const router = useRouter()
  const {ledgerId, isAdmin} = LSProvider.useContext()

  React.useEffect(() => {
    if (isAdmin) {
      void router.replace('/ledgers')
    } else if (ledgerId) {
      void router.replace(`/ledgers/${ledgerId}`)
    }
  }, [isAdmin, ledgerId, router])
  return !isAdmin && !ledgerId ? <div>Unauthorized</div> : null
}
