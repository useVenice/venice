import '@ledger-sync/core-integration-airtable/register.node'
import '@ledger-sync/core-integration-mongodb/register.node'
import '@ledger-sync/core-integration-postgres/register.node'
import '@ledger-sync/core-integration-redis/register.node'
import {
  $appendFile,
  $chokidar,
  $ensureDir,
  $execCommand,
  $fs,
  $path,
  $readFile,
  $writeFile,
  asFunction,
  implementProxyFn,
  kProxyAgent,
  memoize,
  registerDependency,
} from '@ledger-sync/util'
import chokidar from 'chokidar'
import * as dotenv from 'dotenv'
import * as fs from 'fs/promises'
import * as path from 'path'
import {readFile} from 'read-file-safe'
import {writeFile as _writeFile} from 'write-file-safe'
import {makeProxyAgentNext} from './utils.node'

console.log('[Dep] app-config/register.node')

dotenv.config()

registerDependency(
  kProxyAgent,
  asFunction(() =>
    makeProxyAgentNext({
      url: process.env['PROXY_URL'] ?? '',
      cert: process.env['PROXY_CERT'] ?? '',
    }),
  ).singleton(),
)

implementProxyFn(
  $execCommand,
  (command, stdin) =>
    import('execa').then(({execaCommand}) =>
      execaCommand(command, {input: stdin}),
    ),
  {replaceExisting: true}, // Prevent error in case we are already registered
)

implementProxyFn(
  $appendFile,
  async (filePath, content) => {
    console.log(`Will append file to ${filePath}`)
    await fs.appendFile(filePath, content)
  },
  {replaceExisting: true},
)

implementProxyFn(
  $ensureDir,
  memoize(
    async (dir: string) => {
      await fs.mkdir(dir, {recursive: true})
    },
    {isPromise: true},
  ),
)

implementProxyFn($fs, () => fs)
implementProxyFn($path, () => path)
implementProxyFn($chokidar, () => chokidar)
implementProxyFn($readFile, readFile, {replaceExisting: true})

/**
 * Remember to set the TMPDIR env var if we are running on a separate volume (e.g. case-sensitive volume)
 * ❯ node -e "process.env.TMPDIR='/11234'; console.log(require('os').tmpdir())"
 *  /11234
 */
implementProxyFn(
  $writeFile,
  async (filePath, ...args) => {
    console.debug(`Will write file ${filePath}`)
    const ret = await _writeFile(filePath, ...args)
    if (!ret) {
      throw new Error(`Error writing ${filePath}. Check inside write-file-safe`)
    }
    return true
  },
  {replaceExisting: true},
)
