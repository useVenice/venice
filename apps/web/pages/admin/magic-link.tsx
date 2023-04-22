import {getServerUrl} from '@usevenice/app-config/constants'
import {zEndUserId} from '@usevenice/cdk-core'
import {VeniceProvider} from '@usevenice/engine-frontend'
import {Button, ZodForm} from '@usevenice/ui'
import {z} from '@usevenice/util'
import Link from 'next/link'
import {useForm} from 'react-hook-form'
import {PageHeader} from '../../components/PageHeader'
import {PageLayout} from '../../components/PageLayout'
import {copyToClipboard} from '../../contexts/common-contexts'

const formSchema = z.object({
  endUserId: zEndUserId,
  displayName: z
    .string()
    .nullish()
    .describe('displayName: What to call user by'),
  redirectUrl: z
    .string()
    .nullish()
    .describe(
      'redirectUrl: Where to send user to after connect / if they press back button',
    ),
})

export default function MagicLinkPage() {
  const {trpc} = VeniceProvider.useContext()
  const createToken = trpc.adminCreateConnectToken.useMutation({
    onError: console.error,
  })
  const form = useForm<z.infer<typeof formSchema>>()

  const endUserId = form.watch('endUserId')

  return (
    <PageLayout title="Magic link" auth="admin">
      <PageHeader title={['Magic link']} />
      <div className="p-6">
        <ZodForm
          form={form}
          schema={formSchema}
          onSubmit={(values) =>
            createToken.mutate(values, {
              onSuccess: async (data) => {
                const url = new URL('/connect', getServerUrl(null))
                url.searchParams.set('token', data)
                url.searchParams.set('displayName', values.displayName ?? '')
                url.searchParams.set('redirectUrl', values.redirectUrl ?? '')

                await copyToClipboard(url.toString())
                alert('Magic link copied to clipboard')
              },
            })
          }
          renderAfter={({submit}) => (
            <div className="mt-8 flex justify-center gap-4">
              <Button
                onClick={submit}
                disabled={createToken.isLoading || !endUserId}
                className="min-w-[6rem] rounded-lg px-3 py-2 text-sm text-offwhite ring-1 ring-inset ring-venice-black-400 transition-colors hover:bg-venice-black-400 focus:outline-none focus-visible:bg-venice-black-400 disabled:opacity-30">
                {createToken.isLoading ? (
                  <span>Creating...</span>
                ) : (
                  <span>Create magic link</span>
                )}
              </Button>

              <Link
                href={`/admin/pipelines?viewAsUserId=${endUserId ?? ''}`}
                // target="_blank"
                className="min-w-[6rem] rounded-lg px-3 py-2 text-sm text-offwhite ring-1 ring-inset ring-venice-black-400 transition-colors hover:bg-venice-black-400 focus:outline-none focus-visible:bg-venice-black-400 disabled:opacity-30">
                View user pipelines
              </Link>
            </div>
          )}
        />
      </div>
    </PageLayout>
  )
}
