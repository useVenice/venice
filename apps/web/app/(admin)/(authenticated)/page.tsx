'use client'

import {useAuth} from '@clerk/nextjs'

export default function OrganizationRoot() {
  const auth = useAuth()

  return <div>Your org is {auth.orgSlug}</div>
}
