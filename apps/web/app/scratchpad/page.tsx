'use client'

import {SchemaForm} from '@usevenice/ui'
import {z} from '@usevenice/util'

export default function ScratchpadPage() {
  return (
    <SchemaForm
      schema={z.string()}
    />
  )
}
