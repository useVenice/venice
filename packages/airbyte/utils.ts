import walkNodes from 'jsonschema-nodewalker'
import * as path from 'node:path'

export function readJson<T>(filepath: string): T {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return require(path.resolve(process.cwd(), filepath))
}

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
