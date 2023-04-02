import {GetServerSideProps} from 'next'
import type {InferGetServerSidePropsType} from 'next'
import {PageHeader} from '../../components/PageHeader'
import {AdminPageLayout} from '../../components/PageLayout'
import {serverGetUser} from '../../server'
import {Button, ZodForm} from '@usevenice/ui'
import {z} from '@usevenice/util'
import {VeniceProvider} from '@usevenice/engine-frontend'
import {getServerUrl} from '@usevenice/app-config/constants'
import {copyToClipboard} from '../../contexts/common-contexts'
import {zUserId} from '@usevenice/cdk-core'

export const getServerSideProps = (async (ctx) => {
  const [user] = await serverGetUser(ctx)
  if (!user?.id) {
    return {
      redirect: {
        destination: '/admin/auth',
        permanent: false,
      },
    }
  }
  return {
    props: {},
  }
}) satisfies GetServerSideProps

export default function MagicLinkPage(
  _props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const {trpc} = VeniceProvider.useContext()
  const createToken = trpc.adminCreateConnectToken.useMutation({
    onError: console.error,
    onSuccess: async (data) => {
      const url = new URL('/connect', getServerUrl(null))
      url.searchParams.set('token', data)
      await copyToClipboard(url.toString())
      alert('Magic link copied to clipboard')
    },
  })
  return (
    <AdminPageLayout title="Magic link">
      <PageHeader title={['Magic link']} />
      <div className="p-6">
        <ZodForm
          schema={z.object({
            userId: zUserId,
            displayName: z.string().nullish(),
          })}
          onSubmit={(values) => createToken.mutate(values)}
          renderAfter={({submit}) => (
            <div className="mt-8 flex justify-center gap-4">
              <Button
                onClick={submit}
                disabled={createToken.isLoading}
                className="min-w-[6rem] rounded-lg px-3 py-2 text-sm text-offwhite ring-1 ring-inset ring-venice-black-400 transition-colors hover:bg-venice-black-400 focus:outline-none focus-visible:bg-venice-black-400 disabled:opacity-30">
                {createToken.isLoading ? (
                  <span>Creating...</span>
                ) : (
                  <span>Create</span>
                )}
              </Button>
            </div>
          )}
        />
      </div>
    </AdminPageLayout>
  )
}
