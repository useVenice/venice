import type {Id, IDS, MetaService, MetaTable, ZRaw} from '@ledger-sync/cdk-core'
import {IDS_INVERTED} from '@ledger-sync/cdk-core'
import {handlersLink} from '@ledger-sync/cdk-core'
import type {ObjectPartialDeep} from '@ledger-sync/util'
import {deepMerge, R} from '@ledger-sync/util'

// TODO: Validate connection before saving...
// metaStore and syncHelpers appear to be a bit circular relationship...
// So we cannot use the ParsedPipeline type. Consider improving this
// for the future

// Should the mapping of the StandardInstitution happen inside here?

export function makeMetaLinks(metaBase: MetaService) {
  const postSource = (opts: {sourceId: Id['conn']}) =>
    handle({connectionId: opts.sourceId})

  const postDestination = (opts: {
    pipelineId: Id['pipe']
    destinationId: Id['conn']
  }) => handle({connectionId: opts.destinationId})

  const persistInstitution = () => handle({})

  const handle = ({
    pipelineId,
    connectionId,
  }: {
    /** Used for state persistence. Do not pass in until destination handled event already */
    pipelineId?: Id['pipe']
    connectionId?: Id['conn']
  }) =>
    handlersLink({
      connUpdate: async (op) => {
        if (op.id !== connectionId) {
          return op
        }
        const {
          id,
          settings = {},
          envName,
          integrationId,
          institutionId,
          ledgerId,
        } = op

        console.log('[metaLink] connUpdate', {
          connectionId: id,
          settings: R.keys(settings),
          envName,
          integrationId,
          ledgerId,
        })
        await patch('connection', id, {
          settings,
          envName,
          integrationId,
          institutionId,
          ledgerId,
        })
        return op
      },
      stateUpdate: async (op) => {
        if (pipelineId) {
          console.log('[metaLink] stateUpdate', pipelineId, {
            sourceSyncOptions: R.keys(op.sourceSyncOptions ?? {}),
            destinationSyncOptions: R.keys(op.destinationSyncOptions ?? {}),
          })
          await patch('pipeline', pipelineId as Id['pipe'], {
            sourceOptions: op.sourceSyncOptions,
            destinationOptions: op.destinationSyncOptions,
          })
        }
        return op
      },
      data: async (op) => {
        // prettier-ignore
        const {data: {entity, entityName, id}} = op
        if (entityName !== IDS_INVERTED.ins) {
          return op
        }
        console.log('[metaLink] patch', id, entity)
        await patch(entityName, id as Id['ins'], entity as ZRaw['institution'])
        // console.log(`[meta] Did update connection`, id, op.data)
        return op
      },
    })

  const patch = async <TTable extends keyof ZRaw>(
    tableName: TTable,
    id: Id[typeof IDS[TTable]],
    _patch: ObjectPartialDeep<ZRaw[TTable]>,
  ) => {
    if (Object.keys(_patch).length === 0) {
      return
    }
    const table: MetaTable = metaBase.tables[tableName]
    if (table.patch) {
      table.patch(id, _patch)
    } else {
      const data = await table.get(id)
      // console.log(`[patch] Will merge patch and data`, {_patch, data})
      await table.set(id, deepMerge(data, _patch))
    }
  }

  return {postSource, postDestination, persistInstitution}
}
