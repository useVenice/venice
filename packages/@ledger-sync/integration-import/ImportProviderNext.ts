import {Rx, rxjs, UnionToIntersection, z} from '@ledger-sync/util'
import {makeSyncProvider, SyncOperation} from '@ledger-sync/core-sync'
import {ledgerSyncProviderBase} from '@ledger-sync/ledger-sync'
import {formatAppleCard} from './formats/format-apple-card'
import {rampFormat} from './formats/format-ramp'
import {makeImportFormatMap} from './makeImportFormat'

// MARK: - Importing all supported formats

const {formats, zCSVEntity, zPreset} = makeImportFormatMap({
  ramp: rampFormat,
  'apple-card': formatAppleCard,
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

/** NEXT: Implement other import sources such as Airtable */
const zSrcSyncOptions = z.object({csvString: z.string()})

const def = makeSyncProvider.def({
  ...ledgerSyncProviderBase.def,
  name: z.literal('import'),
  connectionSettings: z.object({
    preset: zPreset,
    /** This is outdated. Should be the same as the connection external ID */
    accountExternalId: z.string(),
  }),
  sourceOutputEntity: zSrcEntitySchema,
  integrationConfig: zConfig,
  sourceSyncOptions: zSrcSyncOptions,
})

export const importProvider = makeSyncProvider({
  ...ledgerSyncProviderBase(def, {
    // what do we do with the fact that conn has preset and entity itself has preset?
    sourceMapEntity: ({entity}, conn) =>
      formats[entity.preset].mapEntity(
        // A bit of a type hack... but needed
        entity.row as UnionToIntersection<typeof entity['row']>,
        conn.accountExternalId as Id.external,
      ),
  }),
  sourceSync: ({settings: conn, options: input}) =>
    rxjs.from(formats[conn.preset].parseRows(input.csvString)).pipe(
      Rx.map(
        (row, index): ImportSyncOperation => ({
          // This part is rather generic. we don't know what a row represents just yet
          // At some point we can extract core-integration-csv out of integration-csv
          type: 'data',
          data: {
            id: `row_${index}`,
            entityName: 'csv_row',
            entity: {preset: conn.preset, row} as ImportEntity,
          },
        }),
      ),
      Rx.concatWith(
        rxjs.from<ImportSyncOperation[]>([{type: 'commit'}, {type: 'ready'}]),
      ),
    ),
})
