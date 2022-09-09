import type {Id, IDS, MetaService, MetaTable, ZRaw} from '@ledger-sync/cdk-core'
import {handlersLink} from '@ledger-sync/cdk-core'
import type {ObjectPartialDeep} from '@ledger-sync/util'
import {deepMerge, R} from '@ledger-sync/util'

export function makeMetaLinks(metaBase: MetaService) {
  // TODO: Validate connection before saving...
  // metaStore and syncHelpers appear to be a bit circular relationship...
  // So we cannot use the ParsedPipeline type. Consider improving this
  // for the future

  // Should the mapping of the StandardInstitution happen inside here?
  const institutionDestLink = () =>
    handlersLink({
      data: async (op) => {
        // prettier-ignore
        const {data: {entity, id}} = op
        console.log('[institutionDestLink] patch', id, entity)
        await patch(
          'institution',
          id as Id['ins'],
          entity as ZRaw['institution'],
        )
        // console.log(`[meta] Did update connection`, id, op.data)
        return op
      },
    })

  const postSourceLink = (_pipe: {id?: string | null}) =>
    handlersLink({
      connUpdate: async (op) => {
        const {id, settings = {}} = op
        console.log('[postSourceLink] patch', id, R.keys(settings))
        await patch('connection', id as Id['conn'], {settings})
        // console.log(`[meta] Did update connection`, id, op.data)
        return op
      },
    })

  const postDestinationLink = (pipe: {id?: string | null}) =>
    handlersLink({
      connUpdate: async (op) => {
        const {id, settings = {}, envName, integrationId, ledgerId} = op
        console.log('[postDestinationLink] connUpdate', {
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
          ledgerId,
        })
        return op
      },
      stateUpdate: async (op) => {
        if (pipe.id) {
          console.log('[postDestinationLink] stateUpdate', pipe.id, {
            sourceSyncOptions: R.keys(op.sourceSyncOptions ?? {}),
            destinationSyncOptions: R.keys(op.destinationSyncOptions ?? {}),
          })
          await patch('pipeline', pipe.id as Id['pipe'], {
            sourceOptions: op.sourceSyncOptions,
            destinationOptions: op.destinationSyncOptions,
          })
        }
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

  return {
    institutionDestLink,
    postSourceLink,
    postDestinationLink,
  }
}
