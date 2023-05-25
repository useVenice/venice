import {OpenApiGeneratorV31} from '@asteasolutions/zod-to-openapi'
import type {z} from 'zod'
import _zodToJsonSchema from 'zod-to-json-schema'

import {jsonSchemaWalkNodes} from './jsonschema-nodewalker'

/** Warning will modify input */
export function defaultTitleAsJsonPath<T = unknown>(jsonSchema: T) {
  jsonSchemaWalkNodes(jsonSchema, (node, meta) => {
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

export function enumDescriptionToTitle<T = unknown>(jsonSchema: T) {
  jsonSchemaWalkNodes(jsonSchema, (node) => {
    if (node.anyOf && !node.type) {
      node.type = 'string' // Small hack for react-jsonschema-form
      // without type nothing renders....
    }
    // Skip if we already have one..
    if (node.const && node.description) {
      node.title = node.description
      delete node.description
    }
  })
  return jsonSchema
}

export function zodToJsonSchema(schema: z.ZodTypeAny) {
  return defaultTitleAsJsonPath(
    enumDescriptionToTitle(_zodToJsonSchema(schema)),
  )
}

export function zodToOpenApi(schema: z.ZodTypeAny) {
  return new OpenApiGeneratorV31([schema]).generateComponents().components
}
