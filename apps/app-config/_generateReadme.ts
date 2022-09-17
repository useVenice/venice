import * as fs from 'node:fs'
import * as path from 'node:path'

import tablemark from 'tablemark'

import {R} from '@ledger-sync/util'

import {zBackendEnv} from './env'

const table = R.pipe(
  zBackendEnv.shape,
  R.toPairs,
  R.map(([key, schema]) => ({
    Name: key,
    Description: schema.description
      ?.split('\n')
      .map((s) => s.trim())
      .join('</br>'),
  })),
)

const mkdTable = tablemark(table)
const mkd = `
# Environment variables

${mkdTable}
`

const outPath = path.join(__dirname, 'README.md')
fs.writeFileSync(outPath, mkd)
console.log(`Wrote ${outPath}`)
