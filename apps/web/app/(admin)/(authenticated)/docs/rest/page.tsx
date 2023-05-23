'use client'

import '@stoplight/elements/styles.min.css'

// this pollutes the global CSS space

import {API as StoplightElements} from '@stoplight/elements'
import {useQuery} from '@tanstack/react-query'

import {getRestEndpoint} from '@usevenice/app-config/constants'
import {LoadingText} from '@usevenice/ui'

export default function RestExplorerPage() {
  const oasDocument = useQuery({
    queryKey: ['oasDocument'],
    queryFn: () => fetch(getRestEndpoint(null).href).then((r) => r.json()),
  })
  // console.log('oas', oasDocument.data)
  if (!oasDocument.data) {
    return <LoadingText />
  }

  return (
    <div className="elements-container h-full">
      <StoplightElements
        apiDescriptionDocument={oasDocument.data}
        router="hash"
        // We have to use this because adding search to pathPath does not work
        // as it gets escaped... with include policy the proxy will use the
        // cookie to authenticate us before passing it on
        tryItCredentialsPolicy="include"
      />
    </div>
  )
}
