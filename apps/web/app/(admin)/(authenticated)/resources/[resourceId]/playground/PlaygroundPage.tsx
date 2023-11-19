'use client'

import '@stoplight/elements/styles.min.css'

// this pollutes the global CSS space

import {API as StoplightElements} from '@stoplight/elements'

import type {Id, OpenApiSpec} from '@usevenice/cdk'
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink} from '@usevenice/ui'

export function PlaygroundPage({
  // apikey,
  resourceId,
  oas,
}: {
  resourceId: Id['reso']
  apikey: string
  oas: OpenApiSpec
}) {
  return (
    // eslint-disable-next-line tailwindcss/no-custom-classname
    <div className="elements-container h-full">
      <Breadcrumb className="p-4">
        <BreadcrumbItem>
          {/* We need typed routes... https://github.com/shadcn/ui/pull/133 */}
          <BreadcrumbLink href="/resources">Resources</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink>{resourceId}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink href={`/resources/${resourceId}/playground`}>
            Playground
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <StoplightElements
        apiDescriptionDocument={oas as object}
        router="hash"
        // We have to use this because adding search to pathPath does not work
        // as it gets escaped... with include policy the proxy will use the
        // cookie to authenticate us before passing it on
        tryItCredentialsPolicy="include"
      />
    </div>
  )
}
