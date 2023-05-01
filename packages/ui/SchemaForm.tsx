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
export function SchemaForm({
  schema,
  ...props
}: Omit<React.ComponentProps<typeof JsonSchemaForm>, 'schema' | 'validator'> & {
  schema: z.ZodTypeAny
}) {
  const jsonSchema = zodToJsonSchema(schema) as RJSFSchema
  console.log('[SchemaForm] jsonSchema', jsonSchema)
  return (
    <JsonSchemaForm
      {...props}
      className={cn('schema-form', props.className)}
      schema={jsonSchema}
      validator={validator}
    />
  )
}
