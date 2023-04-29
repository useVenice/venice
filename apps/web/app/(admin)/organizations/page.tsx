'use client'

import {CreateOrganization, OrganizationSwitcher, useAuth} from '@clerk/nextjs'

import {FullScreenCenter} from '@/components/FullScreenCenter'

export default function CreateOrganizationPage() {
  const auth = useAuth()
  console.log('auth', auth)
  return (
    <FullScreenCenter>
      <OrganizationSwitcher hidePersonal />
      <CreateOrganization />
    </FullScreenCenter>
  )
}
