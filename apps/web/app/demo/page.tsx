'use client'

import 'next/image'

import '@/pages/global.css'

import {useSearchParams} from 'next/navigation'

import {VeniceConnectEmbed} from '@usevenice/connect'

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
