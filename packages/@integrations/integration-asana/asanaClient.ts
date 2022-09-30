import type {HTTPError} from '@usevenice/util'
import {createHTTPClient, z, zCast, zFunction} from '@usevenice/util'

export const zConfig = z.object({
  baseURL: z.string().nullish(),
})

export const zCreds = zCast<Asana.Credentials>()
const zTasksParams = z.union([
  z.object({workspace: z.string(), assignee: z.string()}),
  z.object({project: z.string()}),
  z.object({
    opt_fields: z.string().array().nullish(),
    completed_since: z.string().nullish(),
    modified_since: z.string().nullish(),
  }),
])

export const makeAsanaClinet = zFunction(
  [zConfig, zCreds],
  (config, credentials) => {
    const http = createHTTPClient({
      baseURL: config.baseURL ?? 'https://app.asana.com/api/1.0',
      headers: {Authorization: `Bearer ${credentials.personalAccessToken}`},
      requestTransformer: (req) => {
        if (req.params?.opt_fields) {
          req.params.opt_fields = req.params.opt_fields.join(',')
        }
        return req
      },
      errorTransformer: (err) => {
        if (err?.response?.data) {
          return new AsanaError(err.response.data, err)
        }
        return err
      },
    })

    return {
      getCurrentUser: zFunction(() =>
        http.get<Asana.Res<Asana.CurrentUser>>('users/me').then((r) => r.data),
      ),
      getProjects: zFunction(z.object({workspace: z.string()}), (params) =>
        http
          .get<Asana.ListOf<'project'>>('projects', {params})
          .then((r) => r.data),
      ),
      getTasks: zFunction(zTasksParams, (params) =>
        http.get<Asana.ListOf<'task'>>('tasks', {params}).then((r) => r.data),
      ),
      getTask: zFunction(z.string(), (gid) =>
        http.get<Asana.ListOf<'task'>>(`tasks/${gid}`).then((r) => r.data),
      ),
    }
  },
)

export class AsanaError extends Error {
  override name = 'AsanaError'

  constructor(
    public readonly data: unknown,
    public readonly originalError: HTTPError,
  ) {
    super(`[HTTP ${originalError.code}] ${JSON.stringify(data).slice(0, 200)}`)
    Object.setPrototypeOf(this, AsanaError.prototype)
  }
}
