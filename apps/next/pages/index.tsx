import {Layout} from '../components/Layout'
import {useRouter} from 'next/router'
import {useState} from 'react'

export default function HomeScreen() {
  const router = useRouter()
  const [ledgerId, setLedgerId] = useState('')
  return (
    <Layout>
      <div className="container mx-auto flex max-w-screen-2xl flex-1 flex-col items-center justify-center">
        <form
          className="flex flex-col space-y-2"
          onSubmit={(event) => {
            event.preventDefault()
            router.push(`/ledgers/${ledgerId}`)
          }}>
          <label
            className="block text-sm font-medium text-gray-500"
            htmlFor="ledgerId">
            Ledger ID
          </label>

          <div className="flex flex-row items-center space-x-2">
            <input
              className="h-12 rounded-lg border-2 border-gray-200 px-3"
              type="text"
              required
              minLength={1}
              id="ledgerId"
              value={ledgerId}
              onChange={(e) => setLedgerId(e.target.value)}
            />

            <button
              className="h-12 rounded-lg bg-primary px-5 text-white"
              type="submit">
              Go
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
