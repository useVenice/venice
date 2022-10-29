import type {AnyEntityPayload, SyncOperation} from '@usevenice/cdk-core'
import {handlersLink, makeSyncProvider} from '@usevenice/cdk-core'
import {
  $chokidar,
  $path,
  $readFile,
  fromCompletion,
  mapAsync,
  R,
  Rx,
  rxjs,
  safeJSONParse,
  writeJson,
  z,
  zCast,
} from '@usevenice/util'

import {_pathFromId} from './makeFsKVStore'

// MARK: - Source Sync

const zWatchPathsInput = z.object({
  basePath: z.string(),
  paths: z.array(z.string()).optional(),
})

const def = makeSyncProvider.def({
  ...makeSyncProvider.def.defaults,
  name: z.literal('fs'),
  connectionSettings: zWatchPathsInput.pick({basePath: true}),
  /**
   * `paths` only used for sourceSync, not destSync. Though these are not technically states...
   * And they are not safe to just erase if fullSync = true.
   * TODO: Introduce a separate sourceOptions / destinationOptions type later when it becomes an
   * actual problem... for now this issue only impacts FirebaseProvider and FSProvider
   * which are not actually being used as top level providers
   */
  sourceState: zWatchPathsInput.pick({paths: true}),
  sourceOutputEntity: zCast<AnyEntityPayload>(),
  destinationInputEntity: zCast<AnyEntityPayload>(),
})

export const fsProvider = makeSyncProvider({
  ...makeSyncProvider.defaults,
  def,
  sourceSync: ({settings, state}) =>
    _fsWatchPaths$({...settings, ...state}).pipe(_readPathData()),
  destinationSync: ({settings: {basePath}}) =>
    // TODO: Should we add the connectionId to data?
    handlersLink({
      data: ({data}) =>
        fromCompletion(
          writeJson(
            _pathFromId(basePath, `${data.entityName}/${data.id}`),
            data.entity,
          ),
        ),
    }),
})

// MARK: - Source sync helpers

/** id: filename, entityName: dirname */
type FSPathEvent = SyncOperation<
  | {entity: 'add'; entityName: string; id: string; path: string}
  | {entity: 'change'; entityName: string; id: string; path: string}
  | {entity: 'unlink'; entityName: string; id: string; path: string}
>

type FSDataEvent = SyncOperation

function _fsWatchPaths$({basePath, paths}: z.infer<typeof zWatchPathsInput>) {
  return new rxjs.Observable<FSPathEvent>((sub) => {
    console.log('[fsWatchLedger] Start watching', paths)
    const watcher = $chokidar()
      .watch(paths?.map((p) => $path().join(basePath, p)) ?? basePath, {
        awaitWriteFinish: {stabilityThreshold: 1000},
      })
      .on('all', async (event, path) => {
        if (event !== 'add' && event !== 'change' && event !== 'unlink') {
          return
        }
        const entityName = R.pipe(
          path,
          (p) => $path().relative(basePath, p),
          (p) => $path().dirname(p),
        )
        const id = R.pipe(
          path,
          (p) => [$path().basename(p), $path().extname(p)] as const,
          ([base, ext]) =>
            ext === '.json' ? base.slice(0, -1 * ext.length) : null,
        )
        if (!id) {
          // !filename is noop, hacking type
          console.debug(`[fsWatchLedger$] Ignored ${event} ${path}`)
          return
        }
        // const id = filename.slice(0, -1 * extName.length)
        sub.next({
          type: 'data',
          data: {entity: event, id, entityName, path},
        })
      })
      .on('error', (err) => sub.error(err))
      .on('ready', () => {
        sub.next({type: 'ready'})
      })
    return () => {
      console.log('[fsWatchLedger] Stopped watching', paths)
      watcher.close()
    }
  }).pipe(Rx.share())
}

function _readPathData() {
  // Order matters, we want to delay initialDataEmitted until, all the files
  // from before the ready event has been emitted
  // I had multiple attempts but couldn't figure out a way to ignore the order of
  // data events among themselves and only care about the order of data vs. ready event cleanly
  // For helpful Rx illustrations, @see https://thinkrx.io/rxjs/mergeMap-vs-exhaustMap-vs-switchMap-vs-concatMap/
  // For attempts @see https://share.cleanshot.com/ueqr9Z
  return rxjs.pipe(
    mapAsync(async (e: FSPathEvent) => {
      if (e.type !== 'data') {
        return e
      }
      return $readFile(e.data.path)
        .then(safeJSONParse)
        .then((data) => {
          if (!e.data.entity) {
            return undefined
          }
          if (!data && e.data.entity !== 'unlink') {
            console.error(`Invalid json at ${e.data.path}`, data)
            return undefined
          }
          return R.identity<FSDataEvent>({
            type: 'data',
            data: {entity: data, id: e.data.id, entityName: e.data.entityName},
          })
        })
    }, 100), // 100 concurrent readFiles
    Rx.filter((e): e is NonNullable<typeof e> => !!e),
  )
}
