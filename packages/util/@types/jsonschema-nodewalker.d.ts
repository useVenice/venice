/**
 * https://github.com/ralusek/jsonschema-nodewalker
 * This module has very few stars and is not maintained and written in js
 * but it gets the job done... so we use it for now
 */
declare module 'jsonschema-nodewalker' {
  /**
   *
   * @param jsonSchema
   * @param onNode
   *  `node` will contain the schema node we're currently on
   *  `meta` will contain metadata about the current node, such as whether it is
   *  required, whether it is an array item, as well as the structures that its
   *  children returned from their onNode functions.
   */
  export default function walkNodes(
    jsonSchema: unknown,
    onNode: (
      node: {title?: string; description?: string}, // Json schema node
      meta: {path?: string[]; name: string},
    ) => void,
  ): void
}
