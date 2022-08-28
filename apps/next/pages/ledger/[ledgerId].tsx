import {Typography} from '@supabase/ui'
import Head from 'next/head'
import {useRouter} from 'next/router'
import {tw} from 'twind'
import {ConnectionList, NewConnection} from '../../components'

export default function LedgerScreen() {
  const router = useRouter()
  const {ledgerId} = router.query
  return (
    <>
      <Head>
        <title>Viewing as {ledgerId}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        className={tw`flex flex-col space-y-4 w-full h-full max-h-screen mx-auto max-w-[640px] p-4`}>
        <div
          className={tw`flex flex-row justify-between items-center space-x-4`}>
          <Typography.Title level={3}>Viewing as {ledgerId}</Typography.Title>
        </div>

        <NewConnection ledgerId={ledgerId as string} />
        <ConnectionList ledgerId={ledgerId as string} />
      </div>
    </>
  )
}
