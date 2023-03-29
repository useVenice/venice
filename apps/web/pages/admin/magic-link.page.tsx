import {GetServerSideProps} from 'next'
import type {InferGetServerSidePropsType} from 'next'
import {PageHeader} from '../../components/PageHeader'
import {PageLayout} from '../../components/PageLayout'
import {serverGetUser} from '../../server'
import {Button, ZodForm} from '@usevenice/ui'
import {z} from '@usevenice/util'
import {VeniceProvider} from '@usevenice/engine-frontend'

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
  const createToken = trpc.createConnectToken.useMutation({
    onError: console.error,
    // onSettled: () => setDeleteDialogOpen(false),
  })
  return (
    <PageLayout title="Magic link">
      <PageHeader title={['Magic link']} />
      <div className="p-6">
        <ZodForm
          schema={z.object({
            ledgerId: z.string(),
          })}
          onSubmit={(values) => {
            createToken.mutate(values, {
              onSuccess: (data, _variables, _context) => {
                console.log('Success data', data)
              },
            })
          }}
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
    </PageLayout>
  )
}
