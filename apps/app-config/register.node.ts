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
  $makeProxyAgent,
  $path,
  $readFile,
  $writeFile,
  implementProxyFn,
  memoize,
  safeJSONParse,
} from '@ledger-sync/util'
import chokidar from 'chokidar'
import * as dotenv from 'dotenv'
import findConfig from 'find-config'
import * as fs from 'fs/promises'
import * as path from 'path'
import {readFile} from 'read-file-safe'
import tunnel from 'tunnel'
import url from 'url'
import {writeFile as _writeFile} from 'write-file-safe'

console.log('[Dep] app-config/register.node')

export const dotEnvOut = dotenv.config({
  path: findConfig('.env') ?? undefined,
})

// Workaround for https://github.com/motdotla/dotenv/issues/664
// This is in particular useful for YODLEE_CONFIG.production.proxy.cert attribute
// WARNING: YODLEE_CONFIG must be in the compact JSON format for this to work
// In multi-line mode the line break inside string gets confused with line break
// inside JSON values... We would need to either extend dotenv or extend vercel env pull
// to fix it. Shouldn't be a problem during actual deploys though
for (const [k, v] of Object.entries(dotEnvOut.parsed ?? {})) {
  if (safeJSONParse(v) === undefined) {
    const jsonStr = v.split('\n').join('\\n')
    if (safeJSONParse(jsonStr) !== undefined) {
      console.log('Hacking json support for key =', k)
      if (dotEnvOut.parsed) {
        dotEnvOut.parsed[k] = jsonStr
      }
      if (v === process.env[k]) {
        // Do not overwrite
        process.env[k] = jsonStr
      }
    }
  }
}
// console.log('[DEBUG] parsed dotenv', dotEnvOut.parsed)

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
