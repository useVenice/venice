'use client'

import {getServerUrl} from '@usevenice/app-config/constants'
import {adminRouterSchema} from '@usevenice/engine-backend/router/adminRouter'
import {trpcReact} from '@usevenice/engine-frontend'
import {SchemaForm} from '@usevenice/ui'
import {useToast} from '@usevenice/ui/new-components'

import {copyToClipboard} from '@/lib-client/copyToClipboard'
import {useCurrengOrg} from '@/components/viewer-context'

const formSchema = adminRouterSchema.adminCreateConnectToken.input.omit({
  orgId: true,
})

export default function MagicLinkPage() {
  const {orgId} = useCurrengOrg()
  const {toast} = useToast()

  const createToken = trpcReact.adminCreateConnectToken.useMutation({
    onError: (err) => {
      toast({
        title: 'Error creating magic link',
        description: `${err.message}`,
        variant: 'destructive',
      })
    },
  })

  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-semibold tracking-tight">Magic link</h2>
      <SchemaForm
        schema={formSchema}
        loading={createToken.isLoading}
        onSubmit={({formData: values}) => {
          createToken.mutate(
            {...values, orgId},
            {
              onSuccess: async (data) => {
                const url = new URL('/connect', getServerUrl(null))
                url.searchParams.set('token', data)
                url.searchParams.set('displayName', values.displayName ?? '')
                url.searchParams.set('redirectUrl', values.redirectUrl ?? '')

                await copyToClipboard(url.toString())
                toast({
                  title: 'Magic link copied to clipboard',
                  variant: 'success',
                })
              },
            },
          )
        }}
      />
    </div>
  )
}
