import {auth} from '@clerk/nextjs/app-beta'

export default function Page() {
  const data = auth()
  return <div>{JSON.stringify(data, null, 2)}</div>
}
