import {VStack} from '@ledger-sync/app-ui'
import {SidePanel} from '@supabase/ui'
import React from 'react'

export default function LayoutSidePanel({
  children,
  toggle,
  visible,
}: {
  children: React.ReactChild
  toggle: () => void
  visible: boolean
}) {
  return (
    <SidePanel visible={visible} onCancel={toggle} hideFooter>
      <VStack gap="sm">{children}</VStack>
    </SidePanel>
  )
}
