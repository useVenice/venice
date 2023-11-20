import type {ConnectorDef, ConnectorSchemas} from '@usevenice/cdk'
import {connHelpers} from '@usevenice/cdk'
import {zEntityPayload} from '@usevenice/cdk'
import {isAmountUnit, z} from '@usevenice/util'

export type BeancountDestOptions = z.infer<typeof zBeancountDestOptions>
export const zBeancountDestOptions = z.object({
  outPath: z.string(),
  separateByPeriod: z.boolean().optional(),
  saveStdJson: z.boolean().optional(),
  debugSaveBeanJson: z.boolean().optional(),
  operatingCurrency: z.string().refine(isAmountUnit).optional(),
})

export const beancountSchemas = {
  name: z.literal('beancount'),
  destinationState: zBeancountDestOptions,
  destinationInputEntity: zEntityPayload,
} satisfies ConnectorSchemas

export const beancountHelpers = connHelpers(beancountSchemas)

export const beancountDef = {
  name: 'beancount',
  schemas: beancountSchemas,
  metadata: {categories: ['personal-finance'], platforms: ['local']},
} satisfies ConnectorDef<typeof beancountSchemas>

export default beancountDef
