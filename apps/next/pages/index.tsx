import {Button, Input} from '@supabase/ui'
import {useRouter} from 'next/router'
import {useState} from 'react'
import {tw} from 'twind'

export default function HomeScreen() {
  const router = useRouter()
  const [userId, setUserId] = useState('')
  return (
    <div className={tw`flex flex-col items-center justify-center h-screen`}>
      <Input
        label="Ledger Id"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        actions={[
          <Button onClick={() => router.push(`/ledger/${userId}`)}>Go</Button>,
        ]}
      />
    </div>
  )
}
