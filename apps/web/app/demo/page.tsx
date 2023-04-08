'use client'

import {VeniceConnectEmbed} from '@usevenice/connect'
import {useSearchParams} from 'next/navigation'

export default function Demo() {
  const params = useSearchParams()
  const token = params?.get('token')
  return (
    <div className="flex h-screen w-screen flex-col">
      {token ? (
        <VeniceConnectEmbed className="flex-1" params={{token}} />
      ) : (
        <p>
          Please pass a valid venice connect token in the url as query param
          `?token=`
        </p>
      )}
    </div>
  )
}
