'use client'

import {clientIntegrations} from '@usevenice/app-config/integrations/integrations.client'
import {VeniceConnect} from '@usevenice/engine-frontend'

/**
 * Only reason this file exists is because we cannot pass clientIntegrations directly
 * from a server component because it contains function references (i.e. useConnectHook)
 */
export default function ConnectPage() {
  return <VeniceConnect clientIntegrations={clientIntegrations} showExisting />
}
