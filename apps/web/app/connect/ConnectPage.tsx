'use client'

import {providerByName} from '@usevenice/app-config/providers'
import {VeniceConnect} from '@usevenice/engine-frontend'

/**
 * Only reason this file exists is because we cannot pass providerByName directly
 * from a server component because it contains function references (i.e. useConnectHook)
 */
export default function ConnectPage() {
  return <VeniceConnect providerMetaByName={providerByName} showExisting />
}
