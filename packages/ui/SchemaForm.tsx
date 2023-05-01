import Form from '@rjsf/core'
import type {RJSFSchema} from '@rjsf/utils'
import validator from '@rjsf/validator-ajv8'

import type {z} from '@usevenice/util'
import {zodToJsonSchema} from '@usevenice/util'

export function SchemaForm(props: {schema: z.ZodTypeAny; className?: string}) {
  const jsonSchema = zodToJsonSchema(props.schema) as RJSFSchema
  console.log('[SchemaForm] jsonSchema', jsonSchema)
  return (
    <Form
      className={props.className}
      schema={jsonSchema}
      validator={validator}
      onChange={console.log}
      onSubmit={console.log}
      onError={console.log}
    />
  )
}
