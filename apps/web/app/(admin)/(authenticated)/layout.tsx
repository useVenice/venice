'use client'

import {
  CreateOrganization,
  OrganizationSwitcher,
  useAuth,
  useOrganizationList,
  UserButton,
} from '@clerk/nextjs'
import {useEffect} from 'react'

import {EffectContainer} from '@/../../packages/ui'
import {FullScreenCenter} from '@/components/FullScreenCenter'
import {RedirectToNext13} from '@/components/RedirectTo'

export default function AuthedLayout({children}: {children: React.ReactNode}) {
  const auth = useAuth()
  const orgs = useOrganizationList()

  useEffect(() => {
    if (!auth.orgId && orgs.organizationList?.[0]) {
      void orgs.setActive(orgs.organizationList[0])
    }
  }, [auth.orgId, orgs])

  if (!auth.isLoaded) {
    return null
  }
  if (!auth.isSignedIn) {
    return <RedirectToNext13 url="/sign-in" />
  }
  if (!orgs.isLoaded) {
    return null
  }
  if (!auth.orgId) {
    const firstOrg = orgs.organizationList?.[0]
    return !firstOrg ? (
      <FullScreenCenter>
        <CreateOrganization />
      </FullScreenCenter>
    ) : (
      <EffectContainer
        effect={() => {
          // Eventually would be nice to sync active org with URL...
          void orgs.setActive(firstOrg)
        }}
      />
    )
  }

  return (
    <div className="h-screen w-screen">
      <div className="flex justify-between gap-2 p-2">
        <OrganizationSwitcher hidePersonal />
        <UserButton />
      </div>
      {children}
    </div>
  )
}
