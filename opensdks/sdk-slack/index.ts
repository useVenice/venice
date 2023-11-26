import type {OpenAPISpec, SdkDefinition} from '@usevenice/sdk'
import type {
  components,
  external,
  operations,
  paths,
  webhooks,
} from './slack.oas'
import {default as slackOas} from './slack.oas.json'

// Does this work with tree-shaking?
export {slackOas}

export interface SlackTypes {
  components: components
  external: external
  operations: operations
  paths: paths
  webhooks: webhooks
}

export const slackSdkDef = {
  _types: {} as SlackTypes,
  oas: slackOas as {} as OpenAPISpec,
} satisfies SdkDefinition<paths>

export default slackSdkDef

// codegen:start {preset: barrel, include: "./{*.{ts,tsx},*/index.{ts,tsx}}", exclude: "./**/*.{spec,test,fixture,d}.{ts,tsx}"}

// codegen:end
