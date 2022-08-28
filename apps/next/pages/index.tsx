import {useRouter} from 'next/router'
import {useState} from 'react'
import {tw} from 'twind'
import {Layout} from '../components/Layout'

export default function HomeScreen() {
  const router = useRouter()
  const [ledgerId, setLedgerId] = useState('')
  return (
    <Layout>
      <div
        className={tw`container flex flex-col items-center justify-center mx-auto flex-1`}>
        <form
          className={tw`flex flex-col space-y-2`}
          onSubmit={(event) => {
            event.preventDefault()
            router.push(`/ledgers/${ledgerId}`)
          }}>
          <label
            className={tw`block text-sm font-medium text-gray-500`}
            htmlFor="ledgerId">
            Ledger ID
          </label>

          <div className={tw`flex flex-row space-x-2 items-center`}>
            <input
              className={tw`h-12 px-3 border-2 border-gray-200 rounded-lg`}
              type="text"
              required
              minLength={1}
              id="ledgerId"
              value={ledgerId}
              onChange={(e) => setLedgerId(e.target.value)}
            />

            <button
              className={tw`h-12 px-5 text-white bg-primary rounded-lg`}
              type="submit">
              Go
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
