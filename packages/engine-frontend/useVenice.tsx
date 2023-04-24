import React, {useState} from 'react'
// Used to help the typechecker otherwise ts-match would complain about expression being infinitely deep...

import type {ConnectOptions, Id} from '@usevenice/cdk-core'
import {CANCELLATION_TOKEN, extractId, zEnvName} from '@usevenice/cdk-core'
import type {IntegrationInput} from '@usevenice/engine-backend'
import {z} from '@usevenice/util'

import {createTRPCClientProxy} from '@trpc/client'
import {Button, Card, SettingsIcon, ZodForm} from '@usevenice/ui'
import {browserAnalytics} from '../../apps/web/lib/browser-analytics'
import {VeniceProvider} from './VeniceProvider'

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
  /** For developers */

  enablePreconnectPrompt: z.boolean().nullish(),
})

export type UseVenice = ReturnType<typeof useVenice>

export function useVenice({envName, keywords, ...options}: UseVeniceOptions) {
  const {trpc, endUserId, isAdmin, developerMode} = VeniceProvider.useContext()
  const integrationsRes = trpc.listIntegrations.useQuery(
    {},
    {enabled: !!endUserId, staleTime: 15 * 60 * 1000},
  )

  const insRes = trpc.searchInstitutions.useQuery(
    {keywords},
    {enabled: !!endUserId, staleTime: 15 * 60 * 1000}, // TODO: default system wide stale time.
  )
  const deleteResource = trpc.deleteResource.useMutation({})
  const checkResource = trpc.checkResource.useMutation({})

  // Connect should return a shape similar to client.mutation such that
  // consumers can use the same pattern of handling loading and error...
  const veniceConnect = useVeniceConnect({envName, ...options})

  return {
    endUserId,
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
  /** For exsting Existing resource Id */
  /** Optional for new resource */
  institutionId?: Id['ins']

  resourceId?: Id['reso']

  /** TODO: Fix me... */
  preConnectInput?: unknown
}

export function useVeniceConnect({
  envName,
  ...options
}: UseVeniceOptions): VeniceConnect {
  // We are relying on subscription to invalidate now rather than explicit invalidate...
  const {
    connectFnMapRef,
    trpcClient: _client,
    trpc,
    endUserId,
    providerByName,
    openDialog,
  } = VeniceProvider.useContext()
  // Move this inside the context
  const client = React.useMemo(() => createTRPCClientProxy(_client), [_client])
  const trpcCtx = trpc.useContext()

  // indicate whether the connecting (both pre- and post-) is in-flight
  const [isConnecting, setIsConnecting] = useState(false)

  // Connect should return a shape similar to client.mutation such that
  // consumers can use the same pattern of hanlding loading and error...
  // TODO: We should add something to know whether we are currently connecting in a global state
  // And if we are then return early

  const connect = React.useCallback(
    async function (int: IntegrationInput, opts: IntegrationOptions) {
      console.log('[useVeniceConnect] _connect')
      if (!envName || !endUserId) {
        console.log('[useVeniceConnect] Connect missing params, noop', {
          envName,
          endUserId,
        })
        return
      }

      const providerName = extractId(int.id)[1]

      try {
        browserAnalytics.track({
          name: 'connect/session-started',
          data: {providerName},
        })

        const opt: ConnectOptions = {
          institutionExternalId: opts.institutionId
            ? extractId(opts.institutionId)[2]
            : undefined,
          resourceExternalId: opts.resourceId
            ? extractId(opts.resourceId)[2]
            : undefined,
          envName,
        }

        const preConnInputSchema =
          providerByName[providerName]?.def.preConnectInput

        const enablePreconnectPrompt =
          options.enablePreconnectPrompt ??
          !window.localStorage['DISABLE_PRECONNECT_PROMPT']

        // Do not show pre-connect dialog if we are re-connecting
        const preConnIpt =
          !enablePreconnectPrompt ||
          opt.resourceExternalId ||
          !preConnInputSchema
            ? opts.preConnectInput ?? {}
            : await new Promise((resolve, reject) => {
                openDialog(
                  ({close}) => (
                    <Card className="grid gap-6 p-6">
                      <h2 className="grid grid-cols-[auto_1fr] items-center gap-2">
                        <SettingsIcon className="h-5 w-5 fill-venice-gray-muted" />
                        <span className="text-base text-offwhite">
                          Connect parameters
                        </span>
                      </h2>
                      <ZodForm
                        schema={preConnInputSchema as any}
                        onSubmit={(values) => {
                          close()
                          resolve(values)
                        }}
                        renderAfter={({submit}) => (
                          <>
                            <div className="mt-12 flex justify-center gap-4">
                              <Button
                                onClick={(e) => {
                                  e.preventDefault()
                                  close()
                                  reject(CANCELLATION_TOKEN)
                                }}>
                                Cancel
                              </Button>
                              <Button variant="primary" onClick={submit}>
                                Continue
                              </Button>
                            </div>
                          </>
                        )}
                      />
                    </Card>
                  ),
                  {dismissOnClickOutside: true},
                )
              })

        setIsConnecting(true)
        console.log(`[useVeniceConnect] ${int.id} Pre connect`, preConnIpt)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const preConnRes = await trpcCtx.preConnect.fetch(
          [int, opt, preConnIpt],
          {staleTime: 15 * 60 * 1000}, // Good for 15 minutes
        )
        console.log(`[useVeniceConnect] ${int.id} preConnnectRes`, preConnRes)

        const innerConnect = connectFnMapRef.current?.[providerName]
        // e.g. Plaid modal opens

        // HACK: we keep our loading overlay opens underneath the integration
        //   overlay until we fix PlaidProvider to expose more accurate
        //   and fine-grained hook to wait for the open/close events from
        //   the oauth dialog.
        //
        // setIsConnecting(false)

        // TODO: Return inner connect status such as link_session_token to our analytics system

        const res: unknown = await innerConnect?.(preConnRes, opt)
        // e.g. Promise resolves once plaid modal closes successfully.
        // If user cancels CANCELLATION_TOKEN will be thrown and therefore
        // postConnect will not be called
        setIsConnecting(true)
        console.log(`[useVeniceConnect] ${int.id} innerConnectRes`, res)

        const postConRes = await client.postConnect.mutate([res, int, opt])
        await trpcCtx.listConnections.invalidate()
        console.log(`[useVeniceConnect] ${int.id} postConnectRes`, postConRes)
        setIsConnecting(false)

        console.log(`[useVeniceConnect] ${int.id} Post connect`)
        browserAnalytics.track({
          name: 'connect/session-succeeded',
          data: {providerName},
        })
      } catch (err) {
        if (err === CANCELLATION_TOKEN) {
          browserAnalytics.track({
            name: 'connect/session-cancelled',
            data: {providerName},
          })
          console.log(`[useVeniceConnect] ${int.id} Cancelled`)
        } else {
          browserAnalytics.track({
            name: 'connect/session-errored',
            data: {providerName},
          })
          console.error(`[useVeniceConnect] ${int.id} Connect failed`, err)
        }
      } finally {
        setIsConnecting(false)
      }
    },
    [
      envName,
      endUserId,
      providerByName,
      options.enablePreconnectPrompt,
      trpcCtx.preConnect,
      trpcCtx.listConnections,
      connectFnMapRef,
      client.postConnect,
      openDialog,
    ],
  )

  return {connect, isConnecting}
}
