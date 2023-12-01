import type {OpenAPISpec, SdkDefinition} from '@usevenice/sdk'
import type {
  components,
  external,
  operations,
  paths,
  webhooks,
} from './openai.oas'
import {default as openaiOas} from './openai.oas.json'

// Does this work with tree-shaking?
export {openaiOas as openaiOas}

export interface OpenAiTypes {
  components: components
  external: external
  operations: operations
  paths: paths
  webhooks: webhooks
}

export const openaiSdkDef = {
  _types: {} as OpenAiTypes,
  oas: openaiOas as {} as OpenAPISpec,
} satisfies SdkDefinition<paths>

export default openaiSdkDef

// codegen:start {preset: barrel, include: "./{*.{ts,tsx},*/index.{ts,tsx}}", exclude: "./**/*.{spec,test,fixture,d}.{ts,tsx}"}

// codegen:end
