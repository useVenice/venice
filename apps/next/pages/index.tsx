import {useRouter} from 'next/router'
import React from 'react'

import {LSProvider} from '@ledger-sync/engine-frontend'
import {stringifyQueryParams} from '@ledger-sync/util'

export default function HomeScreen() {
  const router = useRouter()
  const {ledgerId, isAdmin} = LSProvider.useContext()
  const query = stringifyQueryParams(router.query)

  React.useEffect(() => {
    if (isAdmin) {
      void router.push({pathname: '/ledgers', query})
    } else if (ledgerId) {
      void router.push({pathname: `/ledgers/${ledgerId}`, query})
    }
  }, [isAdmin, ledgerId, query, router])
  return !isAdmin && !ledgerId ? <div>Unauthorized</div> : null
}
