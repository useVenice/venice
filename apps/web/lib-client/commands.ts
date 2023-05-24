import type {CommandDefinitionMap} from '@usevenice/ui'
import {OpenApiGeneratorV31, z} from '@usevenice/util'

import {zId} from '@/../../packages/cdk-core'

export interface CommandContext {
  activeEntity: {__typename: string; id: string}
}

export const commands = {
  delete_pipeline: {
    icon: 'Trash',
    params: z
      .object({
        pipeline: zId('pipe').openapi('pipeline'),
      })
      .openapi('delete_pipeline_params'),
    handler: ({ctx}) => {},
  },
} satisfies CommandDefinitionMap<CommandContext>

const generator = new OpenApiGeneratorV31([commands.delete_pipeline.params])

// const doc = generator.generateDocument({
//   openapi: '',
//   info: {title: '', version: ''},
// })
const components = generator.generateComponents()
// console.log(JSON.stringify(doc, null, 2))
console.log(JSON.stringify(components, null, 2))
