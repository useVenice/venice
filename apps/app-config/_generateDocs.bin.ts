import * as fs from 'node:fs'
import * as path from 'node:path'

import tablemark from 'tablemark'

import {buildUrl, compact, R, zParser} from '@ledger-sync/util'

import {parseIntConfigsFromEnv, zAllEnv} from './env'
import {loadEnv} from './loadEnv.node'

const envList = R.pipe(
  zAllEnv.shape,
  R.toPairs,
  R.map(([key, schema]) => {
    const cmtLines = R.pipe(
      // ${schema.isOptional() ? '[Optional]' : '<Required>'}
      `${schema.description?.trim() ?? ''}`,
      (desc) => desc.split('\n').map((s) => s.trim()),
      R.compact,
    )

    return {
      key,
      Name: '`' + key + '`',
      Description: cmtLines.join('</br>'),
      dotEnvLine: R.pipe(cmtLines.map((c) => `# ${c}`).join('\n'), (cmts) =>
        compact([
          `${cmts}\n`, // cmtLines.length > 1 && `${cmts}\n`,
          `${key}=""`,
          // comment on same line is not supported by @next/env due to using old version of dotenv.
          // cmtLines.length <= 1 && ` ${cmts}`,
        ]).join(''),
      ),
    }
  }),
)

/** https://vercel.com/docs/deploy-button */
function makeVercelDeployButton(params: {
  // Basic info
  'repository-url': string
  'root-directory'?: string
  'project-name'?: string

  // Env vars
  /** Required env vars */
  env: string
  /** A short description of the Required Environment Variables. */
  envDescription?: string
  /** A link to an explanation of the Required Environment Variables */
  envLink?: string

  // Demo info
  'demo-title'?: string
  'demo-description'?: string
  'demo-url'?: string
  /** URL of the screenshot of an example deployment */
  'demo-image'?: string
}) {
  const url = buildUrl({
    path: 'https://vercel.com/new/clone',
    params,
  })
  return {
    url,
    mkd: `[![Deploy with Vercel](https://vercel.com/button)](${url})`,
  }
}

const deployButton = makeVercelDeployButton({
  'repository-url': 'https://github.com/alkafinance/ledger-sync',
  'root-directory': 'apps/next',
  'project-name': 'my-ledger-sync',
  env: envList.map((e) => e.key).join(','),
  envDescription: 'Not all values are required. Use empty space to skip values',
  envLink:
    'https://github.com/alkafinance/ledger-sync/blob/main/apps/app-config/README.md',
})

const readme = `
# Environment variables

${deployButton.mkd}

${tablemark(envList.map((env) => R.pick(env, ['Name', 'Description'])))}
`
const dotEnvExample = envList.map((env) => env.dotEnvLine).join('\n')

const readmeOutPath = path.join(__dirname, 'README.md')
fs.writeFileSync(readmeOutPath, readme)
console.log(`Wrote ${readmeOutPath}`)

const dotEnvExampleOutPath = path.join(__dirname, '../../', '.env.example')
fs.writeFileSync(dotEnvExampleOutPath, dotEnvExample)
console.log(`Wrote ${dotEnvExampleOutPath}`)

// console.log(dotEnvExample)

if (process.env.NODE_ENV !== 'production') {
  console.log('Test out loading env vars')
  loadEnv()
  const env = zParser(zAllEnv).parseUnknown(process.env)
  const configs = parseIntConfigsFromEnv(env)
  console.log('Parsed env', env)
  console.log('Parsed intConfigs', configs)
}
