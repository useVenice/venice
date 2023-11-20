import type {IntegrationDef, IntegrationSchemas} from '@usevenice/cdk'
import {intHelpers} from '@usevenice/cdk'
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
} satisfies IntegrationSchemas

export const beancountHelpers = intHelpers(beancountSchemas)

export const beancountDef = {
  name: 'beancount',
  schemas: beancountSchemas,
  metadata: {categories: ['personal-finance'], platforms: ['local']},
} satisfies IntegrationDef<typeof beancountSchemas>

export default beancountDef
