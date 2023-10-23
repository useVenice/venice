'use client'

import {clientIntegrations} from '@usevenice/app-config/integrations/integrations.client'
import type {VeniceConnectProps} from '@usevenice/engine-frontend'
import {VeniceConnect} from '@usevenice/engine-frontend'

/**
 * Only reason this file exists is because we cannot pass clientIntegrations directly
 * from a server component because it contains function references (i.e. useConnectHook)
 */
export default function ConnectPage(
  props: Omit<VeniceConnectProps, 'clientIntegrations'>,
) {
  return (
    <VeniceConnect
      // How to we only import the client integrations dynamically that are set up by the org?
      clientIntegrations={clientIntegrations}
      showExisting
      {...props}
    />
  )
}
