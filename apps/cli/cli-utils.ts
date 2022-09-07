import type {AnyZFunction, z} from '@ledger-sync/util'
import {
  compact,
  deepMerge,
  isAsyncIterable,
  isIterable,
  isZodType,
  parseIf,
  pick,
  R,
  routerFromZFunctionMap,
  safeJSONParse,
} from '@ledger-sync/util'
import * as trpc from '@trpc/server'
import cac from 'cac'
import fs from 'fs'
import path from 'path'

export async function printResult(res: unknown, opts?: {json: boolean}) {
  if (isAsyncIterable(res) || isIterable(res)) {
    for await (const r of res) {
      console.log('[printResult]', opts?.json ? JSON.stringify(r) : r)
    }
  } else {
    console.log(
      '[printResult]',
      opts?.json ? JSON.stringify(await res) : await res,
    )
  }
}

export async function readStreamToString(stream: NodeJS.ReadStream) {
  const chunks = []
  for await (const chunk of stream) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks).toString('utf8')
}

/**
 * @returns '' if no data passed in
 * @see https://stackoverflow.com/questions/39801643/detect-if-node-receives-stdin
 */
export async function readStdin() {
  return !process.stdin.isTTY ? readStreamToString(process.stdin) : ''
}

export function readFileContent(filename: string, dirname?: string) {
  const filePath = dirname ? path.join(dirname, filename) : filename
  return fs.readFileSync(filePath, 'utf8')
}

type AnyProcedure = trpc.ProcedureRecord[string]

// TODO Take router._defs and add options based on it so that docs can be shown
// on the command line.

export interface CliOpts {
  /** Validated methods only... */
  safeMode?: boolean
  prepare?: () => void
  cleanup?: () => void
}
const globalStart = Date.now() // Not entirely accurate...
export function cliFromRouter<T extends trpc.AnyRouter>(
  router: T,
  cliOpts?: CliOpts,
) {
  const cli = cac()
  R.pipe(
    pick(router._def, ['queries', 'mutations', 'subscriptions']),
    R.toPairs,
    R.flatMap(([type, map]) =>
      R.toPairs(map).map(
        ([name, procedure]) =>
          [
            type as 'queries' | 'mutations' | 'subscriptions',
            name,
            procedure as AnyProcedure,
          ] as const,
      ),
    ),
    R.uniqBy(([, name]) => name), // cac will natively add commands with the same name twice...
  ).forEach(([type, name, _procedure]) => {
    const method = (
      {
        queries: 'query',
        mutations: 'mutation',
        subscriptions: 'subscription',
      } as const
    )[type]
    // console.debug(`Adding command ${name}`)
    // sub-command is not really working, let's hope we don't have naming conflicts...
    // @see https://share.cleanshot.com/BtVq26
    // Do not name query the same way as we do mutations

    const tuple = R.pipe(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      parseIf((_procedure as any).inputParser, isZodType),
      (t) => (t?._def?.typeName === 'ZodTuple' ? (t as z.ZodTuple) : undefined),
    )
    cli
      // This doesn't work very well as it makes the args passed to action disappear
      // Figure out a better type if we can...
      // .command(compact([name, tuple?.items.length && '[...args]']).join(' '))
      .command(`${name} [...maybeArgs]`)
      .allowUnknownOptions() // No args supported, only options...
      .action(async (args: string[], {'--': _, ...options} = {}) => {
        /**
         * Normalize as sometimes router requires array arguments (or not), esp
         * when generated from zFunction and it is hard for cli to know
         * whether to use array or not.
         */
        const input = R.pipe(
          await readStdin().then(safeJSONParse),
          (stdin) => deepMerge(stdin ?? {}, options),
          (opts) => compact([...args, Object.keys(opts).length > 0 && opts]),
          (arr) => (arr.length <= 1 ? arr[0] : arr),
          (i) => (tuple && !Array.isArray(i) ? compact([i]) : i),
        )

        console.log(`[cli] ${name} input`, input)
        console.log(`[cli] ${name} start at ${Date.now() - globalStart}ms`)
        const start = Date.now()
        await cliOpts?.prepare?.()
        const res = router.createCaller({})[method](name, input)
        await printResult(res)
        await cliOpts?.cleanup?.()
        console.log(`[cli] ${name} done in ${Date.now() - start}ms`)
      })
  })
  // This becomes the default command if user enters nothing at all
  cli.command('', 'No args to output help').action(() => cli.outputHelp())

  // @ts-expect-error
  cli._router = router

  return cli as typeof cli & {_router: T}
}

export function cliFromZFunctionMap(
  map: Record<string, AnyZFunction | unknown>,
  cliOpts?: CliOpts,
) {
  const cli = cliFromRouter(routerFromZFunctionMap(trpc.router(), map), cliOpts)
  // Expose methods that do not have runtime type defintions also for convenience
  if (!cliOpts?.safeMode) {
    const commandKeys = cli.commands.map((c) => c.name.split(' ')[0])
    for (const name of Object.keys(map).filter(
      (k) => !commandKeys.includes(k),
    )) {
      cli
        .command(`${name} [...maybeArgs]`)
        .allowUnknownOptions()
        .action(async (args: string[], {'--': _, ...options}) => {
          console.log(`[cli] ${name} args options`, args, options)
          console.log(`[cli] ${name} start at ${Date.now() - globalStart}ms`)
          const start = Date.now()
          await cliOpts?.prepare?.()
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const res = (map as any)[name](...args, options)
          await printResult(res)
          await cliOpts?.cleanup?.()
          console.log(`[cli] ${name} done in ${Date.now() - start}ms`)
        })
    }
  }
  return cli
}
