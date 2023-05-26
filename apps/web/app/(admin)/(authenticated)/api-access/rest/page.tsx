'use client'

import '@stoplight/elements/styles.min.css'

// this pollutes the global CSS space

import {API as StoplightElements} from '@stoplight/elements'
import {useQuery} from '@tanstack/react-query'

import {getRestEndpoint} from '@usevenice/app-config/constants'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  LoadingText,
} from '@usevenice/ui'

export default function RestExplorerPage() {
  const oasDocument = useQuery({
    queryKey: ['oasDocument'],
    queryFn: () => fetch(getRestEndpoint(null).href).then((r) => r.json()),
  })
  // console.log('oas', oasDocument.data)
  if (!oasDocument.data) {
    return <LoadingText className="block p-4" />
  }

  return (
    // eslint-disable-next-line tailwindcss/no-custom-classname
    <div className="elements-container h-full">
      <Breadcrumb className="p-4">
        <BreadcrumbItem>
          {/* We need typed routes... https://github.com/shadcn/ui/pull/133 */}
          <BreadcrumbLink href="/api-access">Resources</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink href="/api-access/rest">Rest Explorer</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
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
