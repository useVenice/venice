import walkNodes from 'jsonschema-nodewalker'
import type {z} from 'zod'
import _zodToJsonSchema from 'zod-to-json-schema'

/** Warning will modify input */
export function defaultTitleAsJsonPath<T = unknown>(jsonSchema: T) {
  walkNodes(jsonSchema, (node, meta) => {
    // Skip if we already have one..
    if (node.title) {
      return
    }
    // TODO: We can also handle json metadata here as desired
    const title = [...(meta?.path ?? []), meta.name].join('.')
    if (title && !title.endsWith('.')) {
      node.title = title
    }
  })
  return jsonSchema
}

export function zodToJsonSchema(schema: z.ZodTypeAny) {
  return defaultTitleAsJsonPath(_zodToJsonSchema(schema))
}
