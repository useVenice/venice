import {zKVStore} from '@ledger-sync/cdk-core'
import {
  $path,
  joinPath,
  R,
  readDir,
  readJson,
  writeJson,
  z,
  zFunction,
} from '@ledger-sync/util'

export const _pathFromId = (basePath: string, id: string) =>
  joinPath(basePath, `${id}.json`)
export const _idFromPath = (path: string) =>
  $path()
    .basename(path)
    .replace(/\.json$/i, '')

export const makeFsKVStore = zFunction(
  z.object({basePath: z.string()}),
  zKVStore,
  ({basePath}) => ({
    get: async (id) => readJson(_pathFromId(basePath, id)),
    list: async () => {
      const filenames = await readDir(basePath)
      const results = await Promise.all(
        filenames.map(async (filename) => {
          const data = await readJson(joinPath(basePath, filename))
          return [_idFromPath(filename), data] as const
        }),
      )
      return R.compact(results)
    },
    set: (id, data) => writeJson(_pathFromId(basePath, id), data),
  }),
)
