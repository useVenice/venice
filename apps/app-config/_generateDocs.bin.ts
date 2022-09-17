import * as fs from 'node:fs'
import * as path from 'node:path'

import tablemark from 'tablemark'

import {compact, R} from '@ledger-sync/util'

import {zAllEnv} from './env'

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
      Name: key,
      Description: cmtLines.join('</br>'),
      dotEnvLine: R.pipe(cmtLines.map((c) => `# ${c}`).join('\n'), (cmts) =>
        compact([
          cmtLines.length > 1 && `${cmts}\n`,
          `${key}=""`,
          cmtLines.length <= 1 && ` ${cmts}`,
        ]).join(''),
      ),
    }
  }),
)

const readme = `
# Environment variables

${tablemark(envList.map((env) => R.pick(env, ['Name', 'Description'])))}
`
const dotEnvExample = envList.map((env) => env.dotEnvLine).join('\n')

const readmeOutPath = path.join(__dirname, 'README.md')
fs.writeFileSync(readmeOutPath, readme)
console.log(`Wrote ${readmeOutPath}`)

const dotEnvExampleOutPath = path.join(__dirname, '../../', '.env.example')
fs.writeFileSync(dotEnvExampleOutPath, dotEnvExample)
console.log(`Wrote ${dotEnvExampleOutPath}`)

console.log(dotEnvExample)
