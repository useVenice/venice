'use client'

import React from 'react'

import {adminRouterSchema} from '@usevenice/engine-backend/router/adminRouter'
import {_trpcReact} from '@usevenice/engine-frontend'
import {Input, Label, SchemaForm, useToast} from '@usevenice/ui'

import {copyToClipboard} from '@/lib-client/copyToClipboard'

export default function MagicLinkPage() {
  const {toast} = useToast()

  const [endUserId, setEndUserId] = React.useState('')

  const createMagicLink = _trpcReact.adminCreateMagicLink.useMutation({
    trpc: {context: {impersonatedEndUserId: endUserId}},
    meta: {},
    onError: (err) => {
      toast({
        title: 'Error creating magic link',
        description: `${err.message}`,
        variant: 'destructive',
      })
    },
  })

  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-semibold tracking-tight">Magic link</h2>
      <Label htmlFor="endUserId">End user ID</Label>
      <Input
        id="endUserId"
        value={endUserId}
        onChange={(e) => setEndUserId(e.target.value)}
      />
      <hr />
      <SchemaForm
        schema={adminRouterSchema.adminCreateMagicLink.input}
        loading={createMagicLink.isLoading}
        onSubmit={({formData: values}) => {
          createMagicLink.mutate(values, {
            onSuccess: async (data) => {
              await copyToClipboard(data.url)
              toast({
                title: 'Magic link copied to clipboard',
                variant: 'success',
              })
            },
          })
        }}
      />
    </div>
  )
}
