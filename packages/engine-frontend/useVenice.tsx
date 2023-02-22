import React, {useState} from 'react'
// Used to help the typechecker otherwise ts-match would complain about expression being infinitely deep...

import type {ConnectOptions, ConnectWith, Id} from '@usevenice/cdk-core'
import {CANCELLATION_TOKEN, extractId, zEnvName} from '@usevenice/cdk-core'
import type {IntegrationInput} from '@usevenice/engine-backend'
import {z} from '@usevenice/util'

import {createTRPCClientProxy} from '@trpc/client'
import {VeniceProvider} from './VeniceProvider'
import {Button, ZodForm} from '@usevenice/ui'

export type UseVeniceOptions = z.infer<typeof zUseVeniceOptions>
export const zUseVeniceOptions = z.object({
  envName: zEnvName,
  /**
   * Wait to create concept of user / customer in service providers
   * until the last possible moment. Otherwise preConnect will be eagerly called
   * as soon as user loads the webpage which could end up creating a bunch of entities
   * such as StripeCustomer, YodleeUser that never have any material amount of data.
   *
   * TODO: Implement me...
   */
  lazyPreConnect: z.boolean().nullish(),
  /** When searching for for institution  */
  keywords: z.string().nullish(),
})

export type UseVenice = ReturnType<typeof useVenice>

export function useVenice({envName, keywords}: UseVeniceOptions) {
  const {trpc, userId, isAdmin, developerMode} = VeniceProvider.useContext()
  const integrationsRes = trpc.listIntegrations.useQuery(
    {},
    {enabled: !!userId, staleTime: 15 * 60 * 1000},
  )

  const insRes = trpc.searchInstitutions.useQuery(
    {keywords},
    {enabled: !!userId, staleTime: 15 * 60 * 1000}, // TODO: default system wide stale time.
  )
  const deleteResource = trpc.deleteResource.useMutation({})
  const checkResource = trpc.checkResource.useMutation({})

  // Connect should return a shape similar to client.mutation such that
  // consumers can use the same pattern of hanlding loading and error...
  const veniceConnect = useVeniceConnect({envName})

  return {
    userId,
    integrationsRes,
    insRes,
    deleteResource,
    checkResource,
    isAdmin,
    developerMode,
    veniceConnect,
  }
}

interface VeniceConnect {
  isConnecting: boolean
  connect: (
    input: IntegrationInput,
    options: IntegrationOptions,
  ) => Promise<void>
}

interface IntegrationOptions {
  /** For creating initial pipeline in new resource */
  connectWith?: ConnectWith
  /** For exsting Existing resource Id */
  /** Optional for new resource */
  institutionId?: Id['ins']

  resourceId?: Id['reso']
}

/** Also ledger-specific */
export function useVeniceConnect({envName}: UseVeniceOptions): VeniceConnect {
  // We are relying on subscription to invalidate now rather than explicit invalidate...
  const {
    connectFnMapRef,
    trpcClient: _client,
    trpc,
    userId,
    providerByName,
    openDialog,
  } = VeniceProvider.useContext()
  // Move this inside the context
  const client = React.useMemo(() => createTRPCClientProxy(_client), [_client])
  const ctx = trpc.useContext()

  // indicate whether the connecting (both pre- and post-) is in-flight
  const [isConnecting, setIsConnecting] = useState(false)

  // Connect should return a shape similar to client.mutation such that
  // consumers can use the same pattern of hanlding loading and error...
  // TODO: We should add something to know whether we are currently connecting in a global state
  // And if we are then return early

  const connect = React.useCallback(
    async function (int: IntegrationInput, opts: IntegrationOptions) {
      console.log('[useVeniceConnect] _connect')
      if (!envName || !userId) {
        console.log('[useVeniceConnect] Connect missing params, noop', {
          envName,
          userId,
        })
        return
      }

      try {
        const providerName = extractId(int.id)[1]

        const preConnInputSchema =
          providerByName[providerName]?.def.preConnectInput

        const preConnIpt = preConnInputSchema
          ? await new Promise((resolve, reject) => {
              openDialog(({close}) => (
                <ZodForm
                  schema={preConnInputSchema as any}
                  onSubmit={(values) => {
                    close()
                    resolve(values)
                  }}
                  renderAfter={({submit}) => (
                    <>
                      <Button
                        onClick={(e) => {
                          e.preventDefault()
                          close()
                          reject(CANCELLATION_TOKEN)
                        }}>
                        Cancel
                      </Button>
                      <Button onClick={submit}>Launch</Button>
                    </>
                  )}
                />
              ))
            })
          : undefined

        const opt: ConnectOptions = {
          institutionExternalId: opts.institutionId
            ? extractId(opts.institutionId)[2]
            : undefined,
          resourceExternalId: opts.resourceId
            ? extractId(opts.resourceId)[2]
            : undefined,
          envName,
        }
        setIsConnecting(true)
        console.log(`[useVeniceConnect] ${int.id} Will connect`)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const preConnRes = await ctx.preConnect.fetch([int, opt, preConnIpt], {
          staleTime: 15 * 60 * 1000, // Good for 15 minutes
        })
        console.log(`[useVeniceConnect] ${int.id} preConnnectRes`, preConnRes)

        const innerConnect = connectFnMapRef.current?.[providerName]
        // e.g. Plaid modal opens

        // HACK: we keep our loading overlay opens underneath the integration
        //   overlay until we fix PlaidProvider to expose more accurate
        //   and fine-grained hook to wait for the open/close events from
        //   the oauth dialog.
        //
        // setIsConnecting(false)

        const res: unknown = await innerConnect?.(preConnRes, opt)
        // e.g. Promise resolves once plaid modal closes successfully.
        // If user cancels CANCELLATION_TOKEN will be thrown and therefore
        // postConnect will not be called
        setIsConnecting(true)
        console.log(`[useVeniceConnect] ${int.id} innerConnectRes`, res)

        const postConRes = await client.postConnect.mutate([
          res,
          int,
          {...opt, connectWith: opts.connectWith},
        ])
        console.log(`[useVeniceConnect] ${int.id} postConnectRes`, postConRes)
        setIsConnecting(false)

        console.log(`[useVeniceConnect] ${int.id} Did connect`)
      } catch (err) {
        if (err === CANCELLATION_TOKEN) {
          console.log(`[useVeniceConnect] ${int.id} Cancelled`)
        } else {
          console.error(`[useVeniceConnect] ${int.id} Connect failed`, err)
        }
      } finally {
        setIsConnecting(false)
      }
    },
    [
      envName,
      userId,
      providerByName,
      ctx.preConnect,
      connectFnMapRef,
      client.postConnect,
      openDialog,
    ],
  )

  return {connect, isConnecting}
}
