'use client'

import React from 'react'

import '@stoplight/elements/styles.min.css'

// this pollutes the global CSS space

import {API as StoplightElements} from '@stoplight/elements'

import type {Id, OpenApiSpec, PassthroughInput} from '@usevenice/cdk'
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink} from '@usevenice/ui'
import {safeJSONParse} from '@usevenice/util'

export function PlaygroundPage({
  apikey,
  resourceId,
  oas,
}: {
  resourceId: Id['reso']
  apikey: string
  oas: OpenApiSpec
}) {
  React.useEffect(() => {
    const customFetch: typeof fetch = async (input, init) => {
      console.log('will make request', input, init)
      // Remove the baseUrl component from path
      let path = input as string
      for (const server of oas.servers ?? []) {
        path = path.replace(server.url, '')
      }
      return fetch('/api/v0/passthrough', {
        method: 'POST',
        headers: {
          'x-apikey': apikey,
          'x-resource-id': resourceId,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          method: init?.method as 'POST',
          path,
          query: {}, // Would have been part of `path` already...
          headers: init?.headers as Record<string, string>,
          body: safeJSONParse(init?.body as string) as Record<string, unknown>,
        } satisfies PassthroughInput),
      })
    }
    ;(globalThis as any)._stoplight_fetch = customFetch
  }, [apikey, oas.servers, resourceId])
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
