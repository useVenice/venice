import type {SyncOperation} from '@usevenice/cdk-core'
import {makeSyncProvider} from '@usevenice/cdk-core'
import {veniceProviderBase} from '@usevenice/cdk-ledger'
import type {UnionToIntersection} from '@usevenice/util'
import {Rx, rxjs, z} from '@usevenice/util'

import {
  formatAlliantCreditUnion,
  formatAppleCard,
  formatBBVAMexico,
  formatBrex,
  formatBrexCash,
  formatCapitalOne,
  formatCapitalOneBank,
  formatCoinBase,
  formatCoinKeeper,
  formatEtrade,
  formatFirstRepublic,
  formatWise,
  rampFormat,
} from './formats'
import {makeImportFormatMap} from './makeImportFormat'

// MARK: - Importing all supported formats

const {formats, zCSVEntity, zPreset} = makeImportFormatMap({
  ramp: rampFormat,
  'apple-card': formatAppleCard,
  'alliant-credit-union': formatAlliantCreditUnion,
  'bbva-mexico': formatBBVAMexico,
  'brex-cash': formatBrexCash,
  brex: formatBrex,
  'capitalone-bank': formatCapitalOneBank,
  capitalone: formatCapitalOne,
  coinbase: formatCoinBase,
  coinkeeper: formatCoinKeeper,
  etrade: formatEtrade,
  'first-republic': formatFirstRepublic,
  wise: formatWise,
})

type ImportEntity = z.infer<typeof zCSVEntity>

const zSrcEntitySchema = z.object({
  /** Row number */
  id: z.string(),
  /** `row` */
  entityName: z.string(),
  entity: zCSVEntity,
})

type ImportSyncOperation = SyncOperation<z.infer<typeof zSrcEntitySchema>>

// MARK: -

/** Not implemented yet */
const zConfig = z
  .object({
    enabledPresets: z.array(zPreset).nullish(),
    /** e.g. csv, gsheets, airtable, whatever */
    sourceProviders: z.array(z.unknown()).nullish(),
  })
  .nullish()

const def = makeSyncProvider.def({
  ...veniceProviderBase.def,
  name: z.literal('import'),
  resourceSettings: z.object({
    preset: zPreset,
    /** This is outdated. Should be the same as the resource external ID */
    accountExternalId: z.string(),
  }),
  sourceOutputEntity: zSrcEntitySchema,
  integrationConfig: zConfig,
  /** NEXT: Implement other import sources such as Airtable */
  // csvString belongs in syncState because among other things we can actually naturally
  // persist the csvString used for every single sync as part of the pipeline_jobs table!
  sourceState: z.object({csvString: z.string()}),
})

export const importProvider = makeSyncProvider({
  metadata: {
    displayName: 'CSV Import',
    categories: ['flat-files'],
    logoUrl: '/_assets/logo-import.png',
  },
  ...veniceProviderBase(def, {
    // what do we do with the fact that conn has preset and entity itself has preset?
    sourceMapEntity: ({entity}, conn) =>
      formats[entity.preset].mapEntity(
        // A bit of a type hack... but needed
        entity.row as UnionToIntersection<(typeof entity)['row']>,
        conn.accountExternalId as ExternalId,
      ),
  }),
  sourceSync: ({settings, state}) =>
    rxjs.from(formats[settings.preset].parseRows(state.csvString)).pipe(
      Rx.map(
        (row, index): ImportSyncOperation => ({
          // This part is rather generic. we don't know what a row represents just yet
          // At some point we can extract core-integration-csv out of integration-csv
          type: 'data',
          data: {
            id: `row_${index}`,
            entityName: 'csv_row',
            entity: {preset: settings.preset, row} as ImportEntity,
          },
        }),
      ),
      Rx.concatWith(
        rxjs.from<ImportSyncOperation[]>([{type: 'commit'}, {type: 'ready'}]),
      ),
    ),
})
