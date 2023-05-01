import type {ThemeProps} from '@rjsf/core'
import {withTheme} from '@rjsf/core'
import type {RJSFSchema} from '@rjsf/utils'
import validator from '@rjsf/validator-ajv8'

import type {z} from '@usevenice/util'
import {zodToJsonSchema} from '@usevenice/util'

import {cn} from './utils'

const theme: ThemeProps = {widgets: {}}

/** TODO: Actually customize with our own components... */
export const JsonSchemaForm = withTheme(theme)

// Consider renaming this to zodSchemaForm
export function SchemaForm(props: {schema: z.ZodTypeAny; className?: string}) {
  const jsonSchema = zodToJsonSchema(props.schema) as RJSFSchema
  console.log('[SchemaForm] jsonSchema', jsonSchema)
  return (
    <JsonSchemaForm
      className={cn('schema-form', props.className)}
      schema={jsonSchema}
      validator={validator}
      onChange={console.log}
      onSubmit={console.log}
      onError={console.log}
    />
  )
}
