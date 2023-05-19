import {clerkClient} from '@clerk/nextjs'

import {kApikeyMetadata} from '@usevenice/app-config/constants'
import type {Viewer} from '@usevenice/cdk-core'
import {hasRole} from '@usevenice/cdk-core'
import {makeUlid} from '@usevenice/util'

import {encodeApiKey} from '@/server'
import {serverComponentGetViewer} from '@/server/server-component-helpers'

export default async function ApiKeyPage() {
  const viewer = await serverComponentGetViewer()
  const apikey = await getOrCreateApikey(viewer)

  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-semibold tracking-tight">API Keys</h2>
      {/* TODO: Need component to display information */}
      <pre>{apikey}</pre>
    </div>
  )
}

async function getOrCreateApikey(viewer: Viewer) {
  const orgId = hasRole(viewer, ['org', 'user']) ? viewer.orgId : null
  const userId = hasRole(viewer, ['user']) ? viewer.userId : null

  if (orgId) {
    const res = await clerkClient.organizations.getOrganization({
      organizationId: orgId,
    })
    if (typeof res.privateMetadata[kApikeyMetadata] === 'string') {
      return encodeApiKey(orgId, res.privateMetadata[kApikeyMetadata])
    }
    const key = `key_${makeUlid()}`
    // updateMetadata will do a deepMerge, unlike simple update
    await clerkClient.organizations.updateOrganizationMetadata(orgId, {
      privateMetadata: {[kApikeyMetadata]: key},
    })
    return encodeApiKey(orgId, key)
  }
  if (userId) {
    const res = await clerkClient.users.getUser(userId)
    if (typeof res.privateMetadata[kApikeyMetadata] === 'string') {
      return encodeApiKey(userId, res.privateMetadata[kApikeyMetadata])
    }
    const key = `key_${makeUlid()}`
    // updateMetadata will do a deepMerge, unlike simple update
    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: {[kApikeyMetadata]: key},
    })
    return encodeApiKey(userId, key)
  }
  return null
}
