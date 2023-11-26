import type {OpenAPISpec, SdkDefinition} from '@usevenice/sdk'
import type {
  components,
  external,
  operations,
  paths,
  webhooks,
} from './discord.oas'
import {default as discordOas} from './discord.oas.json'

// Does this work with tree-shaking?
export {discordOas}

export interface DiscordTypes {
  components: components
  external: external
  operations: operations
  paths: paths
  webhooks: webhooks
}

export const discordSdkDef = {
  _types: {} as DiscordTypes,
  // Consider using the import * as y syntax so clicking on .oas takes you to the JSON object itself!
  // @see https://share.cleanshot.com/rsKvGsBs
  oas: discordOas as {} as OpenAPISpec,
} satisfies SdkDefinition<paths>

export default discordSdkDef

// codegen:start {preset: barrel, include: "./{*.{ts,tsx},*/index.{ts,tsx}}", exclude: "./**/*.{spec,test,fixture,d}.{ts,tsx}"}

// codegen:end
