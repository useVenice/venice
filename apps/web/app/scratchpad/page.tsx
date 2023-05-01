'use client'

import {Input, Label} from '@usevenice/ui/new-components'

import '../(admin)/global.css'

import {SchemaForm} from '@usevenice/ui'
import {z} from '@usevenice/util'

export default function ScratchpadPage() {
  return (
    <div>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input id="name" value="Pedro Duarte" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="username" className="text-right">
            Username
          </Label>
          <Input id="username" value="@peduarte" className="col-span-3" />
        </div>
      </div>
      <SchemaForm
        className="bg-slate-50 p-3 [&_input]:bg-red-50"
        schema={z.string()}
      />
    </div>
  )
}
