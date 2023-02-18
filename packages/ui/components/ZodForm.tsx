import {z} from '@usevenice/util'
import React from 'react'

export interface ZodFormProps<TSchema extends z.AnyZodObject> {
  schema: TSchema
  initialValues: z.infer<TSchema>
}

/** Single layer, not nested, keeping it simple */
export function ZodForm<TSchema extends z.AnyZodObject>({
  schema,
  initialValues,
}: ZodFormProps<TSchema>) {
  const [values, setValues] = React.useState(initialValues)
  return (
    <form>
      {Object.entries(schema.shape).map(([key, fieldSchema]) => {
        const value = values[key as keyof typeof values]
        const onChange = (newValue: typeof value) =>
          setValues((vals) => ({...vals, [key]: newValue}))
        if (fieldSchema instanceof z.ZodString) {
          // Alternatively we can use fieldSchema.description?
          return (
            <React.Fragment key={key}>
              <label>{key}</label>
              <input
                type="text"
                required
                value={value}
                onChange={(event) =>
                  onChange(event.currentTarget.value as typeof value)
                }
                className="input-bordered input w-full"
              />
            </React.Fragment>
          )
        }
        if (
          fieldSchema instanceof z.ZodEnum ||
          fieldSchema instanceof z.ZodNativeEnum
        ) {
          const options: string[] =
            fieldSchema instanceof z.ZodEnum
              ? fieldSchema.options
              : Object.values(fieldSchema.enum)
          // (fieldSchema.options as string[])
          // Return Select field..
          return (
            <React.Fragment key={key}>
              <label>{key}</label>
              {options.map((option) => option)}
            </React.Fragment>
          )
        }
        // return null & log warning?
        return key
      })}
    </form>
  )
}
