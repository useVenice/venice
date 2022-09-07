// Better to use this...
import * as path from 'path'
import {loadEnvConfig} from '@next/env'
import findConfig from 'find-config'

import {safeJSONParse} from '@ledger-sync/util'

export function loadEnv() {
  const envPath = findConfig('.env')
  if (!envPath) {
    return {}
  }
  const loaded = loadEnvConfig(path.dirname(envPath))
  const envs = loaded.combinedEnv as Record<string, string>

  // Workaround for https://github.com/motdotla/dotenv/issues/664
  // This is in particular useful for YODLEE_CONFIG.production.proxy.cert attribute
  // WARNING: YODLEE_CONFIG must be in the compact JSON format for this to work
  // In multi-line mode the line break inside string gets confused with line break
  // inside JSON values... We would need to either extend dotenv or extend vercel env pull
  // to fix it. Shouldn't be a problem during actual deploys though
  for (const [k, v] of Object.entries(envs ?? {})) {
    if (safeJSONParse(v) === undefined) {
      const jsonStr = v.split('\n').join('\\n')
      if (safeJSONParse(jsonStr) !== undefined) {
        // console.log('Hacking json support for key =', k)
        envs[k] = jsonStr
        if (v === process.env[k]) {
          // Do not overwrite
          process.env[k] = jsonStr
        }
      }
    }
  }
  return envs
}

// console.log('[DEBUG] parsed dotenv', dotEnvOut.parsed)
