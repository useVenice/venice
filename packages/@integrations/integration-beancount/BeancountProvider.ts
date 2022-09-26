import {makeSyncProvider} from '@usevenice/cdk-core'
import type {StdCache} from '@usevenice/cdk-ledger'
import {cachingLink, veniceProviderBase} from '@usevenice/cdk-ledger'
import type {Standard} from '@usevenice/standard'
import {
  $writeFile,
  fromCompletion,
  isAmountUnit,
  objectEntries,
  stableStringify,
  z,
} from '@usevenice/util'

import {beanJsonToDir} from './bean-fs-utils'
import {convBeanFile, convBeanJsonToStdJson} from './beancountConverters'

export type BeancountDestOptions = z.infer<typeof zBeancountDestOptions>
export const zBeancountDestOptions = z.object({
  outPath: z.string(),
  separateByPeriod: z.boolean().optional(),
  saveStdJson: z.boolean().optional(),
  debugSaveBeanJson: z.boolean().optional(),
  operatingCurrency: z.string().refine(isAmountUnit).optional(),
})

const def = makeSyncProvider.def({
  ...veniceProviderBase.def,
  name: z.literal('beancount'),
  destinationState: zBeancountDestOptions,
})

export const beancountProvider = makeSyncProvider({
  ...veniceProviderBase(def, {sourceMapEntity: undefined}),
  destinationSync: ({state: options}) =>
    cachingLink((cache) => fromCompletion(outputBeanFiles(cache, options))),
  sourceSync: undefined,
})

export async function outputBeanFiles(
  cache: StdCache,
  options: BeancountDestOptions,
) {
  console.log('[BeancountDestination] Will commit')
  if (options.saveStdJson) {
    const jsonOutPath = options.outPath.replace(/\.bean$/, '.json')
    console.log(`Will export standard json to ${jsonOutPath}`)
    await $writeFile(jsonOutPath, stableStringify(cache, {space: 2}))
  }
  const beanJson = convBeanJsonToStdJson.reverse({
    entities: objectEntries(cache).flatMap(([type, entityById]) =>
      objectEntries(entityById).map(
        ([, entity]) => [type, entity] as Standard.TypeAndEntity,
      ),
    ),
    variant: 'standard',
    version: '1',
    ledger: options.operatingCurrency
      ? {defaultUnit: options.operatingCurrency}
      : undefined,
  })

  if (options.debugSaveBeanJson) {
    const jsonOutPath = [options.outPath, '.json'].join('')
    console.log(`Will export beanJson json to ${jsonOutPath}`)
    await $writeFile(jsonOutPath, stableStringify(beanJson, {space: 2}))
  }
  const beanString = await convBeanFile.reverse(beanJson)
  await $writeFile(options.outPath, beanString)
  console.log(`[BeancountDestination] Wrote to ${options.outPath}`)

  if (options.separateByPeriod) {
    await beanJsonToDir({
      beanJson,
      operatingCurrency: options.operatingCurrency,
      outPath: options.outPath.replace(/\.bean$/, ''),
    })
  }
}
