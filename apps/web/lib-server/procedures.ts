// import '@usevenice/app-config/register.node'
import {clerkClient} from '@clerk/nextjs'

import {
  backendEnv,
  makePostgresClient,
} from '@usevenice/app-config/backendConfig'
import {kApikeyMetadata} from '@usevenice/app-config/constants'
import type {Viewer} from '@usevenice/cdk'
import {hasRole} from '@usevenice/cdk'
import {makeUlid} from '@usevenice/util'

import {encodeApiKey} from '@/lib-server'

export const {getPool, sql} = makePostgresClient({
  databaseUrl: backendEnv.POSTGRES_OR_WEBHOOK_URL,
  transformFieldNames: false,
})

export async function getOrCreateApikey(viewer: Viewer) {
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
  throw new Error('Only users and organizations can have apikeys')
}
