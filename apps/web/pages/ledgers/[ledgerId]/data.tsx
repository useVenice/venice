import {createClient} from '@supabase/supabase-js'
import React from 'react'

import {VeniceProvider} from '@usevenice/engine-frontend'

// https://app.supabase.com/project/hhnxsazpojeczkeeifli/settings/api
export const supabase = createClient(
  'https://hhnxsazpojeczkeeifli.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhobnhzYXpwb2plY3prZWVpZmxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjAyNjgwOTIsImV4cCI6MTk3NTg0NDA5Mn0.ZDmf1sjsr-UxW2bPgdj3uaqJNUSqkZh8vCB1phn3qqs',
)

export default function DataPage() {
  const {ledgerId} = VeniceProvider.useContext()
  const [items, setItems] = React.useState([] as any[])
  React.useEffect(() => {
    void supabase
      .from('connection')
      .select('*')
      .eq('ledger_id', ledgerId)
      .then((res) => {
        console.log('res', res)
        setItems(res.data ?? [])
      })
  }, [ledgerId])
  return (
    <div>
      <div>hello world</div>
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.id}</li>
        ))}
      </ul>
    </div>
  )
}
