import {Layout} from '../components/Layout'
import {useRouter} from 'next/router'
import {useState} from 'react'

export default function HomeScreen() {
  const router = useRouter()
  const [ledgerId, setLedgerId] = useState('')
  return (
    <Layout>
      <div className="mx-auto flex max-w-screen-2xl flex-1 flex-col items-center justify-center">
        <form
          onSubmit={(event) => {
            event.preventDefault()
            router.push(`/ledgers/${ledgerId}`)
          }}>
          <div className="form-control">
            <label htmlFor="ledgerId" className="label">
              <span className="label-text">Ledger ID</span>
            </label>

            <div className="flex flex-row items-center space-x-2">
              <input
                type="text"
                required
                minLength={1}
                id="ledgerId"
                value={ledgerId}
                onChange={(e) => setLedgerId(e.target.value)}
                className="input-bordered input"
              />

              <button className="btn btn-primary text-lg" type="submit">
                Go
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  )
}
