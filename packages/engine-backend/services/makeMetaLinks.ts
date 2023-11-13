import type {AnyEntityPayload, Id, IDS, OpHandlers, ZRaw} from '@usevenice/cdk'
import {extractId, handlersLink, IDS_INVERTED, makeId} from '@usevenice/cdk'
import type {ObjectPartialDeep} from '@usevenice/util'
import {deepMerge, R} from '@usevenice/util'

import type {MetaService, MetaTable} from './metaService'

// TODO: Validate connection before saving...
// metaStore and syncHelpers appear to be a bit circular relationship...
// So we cannot use the ParsedPipeline type. Consider improving this
// for the future

// Should the mapping of the StandardInstitution happen inside here?

export function makeMetaLinks(metaBase: MetaService) {
  type Res = Pick<ZRaw['resource'], 'id' | 'integrationId' | 'endUserId'>
  type Pipe = Pick<
    ZRaw['pipeline'],
    'id' | 'sourceId' | 'destinationId' | 'linkOptions'
  >

  const postSource = (opts: {src: Res}) => handle({resource: opts.src})

  const postDestination = (opts: {pipeline: Pipe; dest: Res}) =>
    handle({resource: opts.dest, pipeline: opts.pipeline})

  const persistInstitution = () => handle({})

  const handle = (...args: Parameters<typeof handlers>) =>
    handlersLink<AnyEntityPayload>({
      resoUpdate: async (op) => {
        await handlers(...args).resoUpdate(op)
        return op
      },
      stateUpdate: async (op) => {
        await handlers(...args).stateUpdate(op)
        return op
      },
      data: async (op) => {
        await handlers(...args).data(op)
        return op
      },
    })

  const handlers = ({
    pipeline,
    resource,
  }: {
    /** Used for state persistence. Do not pass in until destination handled event already */
    pipeline?: Pipe
    resource?: Res
  }) =>
    ({
      // TODO: make standard insitution and connection here...
      resoUpdate: async (op) => {
        if (op.id !== resource?.id) {
          console.warn(`Unexpected resource id ${op.id} != ${resource?.id}`)
          return
        }
        const {id, settings = {}, institution} = op
        const providerName = extractId(resource.id)[1]
        console.log('[metaLink] resoUpdate', {
          id,
          settings: R.keys(settings),
          institution,
          existingResource: resource,
        })

        const institutionId = institution
          ? makeId('ins', providerName, institution.externalId)
          : undefined

        // Can we run this in one transaction?
        if (institution && institutionId) {
          // Technically requires elevated permissions...
          await patch('institution', institutionId, {
            id: institutionId,
            external: institution.data,
            // Map standard here?
          })
        }
        // Workaround for default integrations such as `int_plaid` etc which
        // do not exist in the database and would otherwise cause foreign key issue
        // Is it a hack? When there is no 3rd component of id, does that always
        // mean that the integration does not in fact exist in database?
        const integrationId =
          resource.integrationId && extractId(resource.integrationId)[2] === ''
            ? undefined
            : resource.integrationId

        // Can we run this in one transaction?

        await patch('resource', id, {
          id,
          settings,
          // It is also an issue that institution may not exist at the initial time of
          // connection establishing..
          integrationId,
          institutionId,
          // maybe we should distinguish between setDefaults (from existingResource) vs. actually
          // updating the values...
          endUserId: resource.endUserId,
        })
      },
      stateUpdate: async (op) => {
        console.log('[metaLink] stateUpdate', pipeline?.id, {
          sourceState: R.keys(op.sourceState ?? {}),
          destinationState: R.keys(op.destinationState ?? {}),
        })
        if (pipeline) {
          // Workaround for default pipeline such as `conn_postgres` etc which
          // does not exist in the database...
          const sourceId =
            pipeline.sourceId && extractId(pipeline.sourceId)[2] === ''
              ? undefined
              : pipeline.sourceId
          const destinationId =
            pipeline.destinationId &&
            extractId(pipeline.destinationId)[2] === ''
              ? undefined
              : pipeline.destinationId
          await patch('pipeline', pipeline.id, {
            sourceState: op.sourceState,
            destinationState: op.destinationState,
            // Should be part of setDefaults...
            sourceId,
            destinationId,
            id: pipeline.id,
            linkOptions: pipeline.linkOptions,
            lastSyncStartedAt: op.subtype === 'init' ? new Date() : undefined,
            // Idealy this should use the database timestamp if possible (e.g. postgres)
            // However we don't always know if db supports it (e.g. local files...)
            lastSyncCompletedAt:
              op.subtype === 'complete' ? new Date() : undefined,
          })
        }
      },
      data: async (op) => {
        // prettier-ignore
        const {data: {entity, entityName, id}} = op
        if (entityName !== IDS_INVERTED.ins) {
          return
        }
        console.log('[metaLink] patch', id, entity)
        await patch(
          'institution',
          id as Id['ins'],
          entity as ZRaw['institution'],
        )
        // console.log(`[meta] Did update resource`, id, op.data)
      },
    } satisfies OpHandlers<Promise<void>>)

  // TODO: Dedupe with contextHelpers
  const patch = async <TTable extends keyof ZRaw>(
    tableName: TTable,
    id: Id[(typeof IDS)[TTable]],
    _patch: ObjectPartialDeep<ZRaw[TTable]>,
  ) => {
    if (Object.keys(_patch).length === 0) {
      return
    }
    const table: MetaTable = metaBase.tables[tableName]
    if (table.patch) {
      await table.patch(id, _patch)
    } else {
      const data = await table.get(id)
      // console.log(`[patch] Will merge patch and data`, {_patch, data})
      await table.set(id, deepMerge(data ?? {}, _patch))
    }
  }

  return {
    postSource,
    postDestination,
    persistInstitution,
    handlers,
    patch,
  }
}
