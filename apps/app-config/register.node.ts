import '@ledger-sync/core-integration-airtable/register.node'
import '@ledger-sync/core-integration-mongodb/register.node'
import '@ledger-sync/core-integration-postgres/register.node'
import '@ledger-sync/core-integration-redis/register.node'

import * as fs from 'fs/promises'
import * as path from 'path'
import chokidar from 'chokidar'
import {readFile} from 'read-file-safe'
import tunnel from 'tunnel'
import url from 'url'
import {writeFile as _writeFile} from 'write-file-safe'

import {
  $appendFile,
  $chokidar,
  $ensureDir,
  $execCommand,
  $fs,
  $makeProxyAgent,
  $path,
  $readFile,
  $writeFile,
  implementProxyFn,
  memoize,
} from '@ledger-sync/util'

import {loadEnv} from './utils'

console.log('[Dep] app-config/register.node')

/** Side effect here */
export const loadedEnv = loadEnv()

implementProxyFn(
  $makeProxyAgent,
  (input) => {
    // Seems that the default value get overwritten by explicit undefined
    // value from envkey. Here we try to account for that
    // Would be nice if such hack is not required.
    const {hostname, port, auth} = url.parse(input.url)
    if (!hostname || !port) {
      return undefined
    }
    // Alternative workaround for https://github.com/motdotla/dotenv/issues/664
    // Workaround for when newline in certs gets lost... due to the same dotenv issue...
    // Maybe we should really hack dotenv instead
    // let cert = input.cert
    // if (cert && !cert.includes('\n')) {
    //   cert = [
    //     '-----BEGIN CERTIFICATE-----',
    //     ...R.chunk(
    //       cert
    //         .replace(/^-----BEGIN CERTIFICATE-----/, '')
    //         .replace(/-----END CERTIFICATE-----$/, '')
    //         .split(''),
    //       64,
    //     ).map((l) => l.join('')),
    //     '-----END CERTIFICATE-----',
    //   ].join('\n')
    // }

    return tunnel.httpsOverHttp({
      ca: input.cert ? [Buffer.from(input.cert)] : [],
      proxy: {
        host: hostname,
        port: Number.parseInt(port, 10),
        proxyAuth: auth ?? undefined,
        headers: {},
      },
    })
  },
  {replaceExisting: true},
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
