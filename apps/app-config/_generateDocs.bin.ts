import * as fs from 'node:fs'
import * as path from 'node:path'

import tablemark from 'tablemark'

import {compact, R} from '@ledger-sync/util'

import {zBackendEnv} from './env'

const envList = R.pipe(
  zBackendEnv.shape,
  R.toPairs,
  R.map(([key, schema]) => {
    const comments =
      compact([
        schema.isOptional() ? '[Optional]' : '<Required>',
        schema.description,
      ])
        .join(' ')
        .split('\n')
        .map((s) => s.trim()) ?? []

    return {
      Name: key,
      Description: comments?.join('</br>'),
      dotEnvLine: R.pipe(comments.map((c) => `# ${c}`).join('\n'), (cmts) =>
        compact([
          comments.length > 1 && `${cmts}\n`,
          `${key}=""`,
          comments.length <= 1 && ` ${cmts}`,
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
