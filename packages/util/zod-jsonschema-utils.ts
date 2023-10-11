import {OpenApiGeneratorV31} from '@asteasolutions/zod-to-openapi'
import type {z} from 'zod'
import _zodToJsonSchema from 'zod-to-json-schema'

import {R} from '.'
import {jsonSchemaWalkNodes} from './jsonschema-nodewalker'

/** Warning will modify input */
export function defaultTitleAsJsonPath<T = unknown>(jsonSchema: T) {
  jsonSchemaWalkNodes(jsonSchema, (node, meta) => {
    // Skip if we already have one..

    // TODO: We can also handle json metadata here as desired
    const jsonPath = [...(meta?.path ?? []), meta.name]
      .filter((n) => !!n) // Filter out nesting from things like anyOf
      .join('.')

    if (node.title) {
      // @see https://share.cleanshot.com/16sDgL6D
      node.title = `${jsonPath}: ${node.title}`
    } else if (jsonPath && !jsonPath.endsWith('.')) {
      node.title = jsonPath
    }
  })
  return jsonSchema
}

export function ensureNodeTitle<T = unknown>(jsonSchema: T) {
  jsonSchemaWalkNodes(jsonSchema, (node, meta) => {
    if (!node.type && node.anyOf && node.anyOf[0]?.type) {
      const types = R.uniq(node.anyOf.map((x) => x.type))
      // Small hack for react-jsonschema-form
      // without type sometimes nothing renders.... (e.g. enum of string)
      if (types.length === 1) {
        // console.warn(`Multiple types in anyOf: ${types}, skip defaulting`)
        node.type = types[0]
      }
    }
    // Ensure option title
    const parent = meta.lineage && meta.lineage[meta.lineage.length - 1]
    if (parent?.anyOf && node.description && !node.title) {
      node.title = node.description
      delete node.description
    }
    // Checkbox works better with title
    if (!node.title && node.description) {
      node.title = node.description
      delete node.description
    }
  })
  return jsonSchema
}

export function zodToJsonSchema(schema: z.ZodTypeAny) {
  // Defaulting title should occur last, this way we don't end up with extraneous one
  return defaultTitleAsJsonPath(ensureNodeTitle(_zodToJsonSchema(schema)))
}

export function zodToOpenApi(schema: z.ZodTypeAny) {
  return new OpenApiGeneratorV31([schema]).generateComponents().components
}
