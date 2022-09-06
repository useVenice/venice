import {safeJSONParse} from '@ledger-sync/util'
import * as dotenv from 'dotenv'
import findConfig from 'find-config'

export function loadDotEnv() {
  const dotEnvOut = dotenv.config({
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
        // console.log('Hacking json support for key =', k)
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
  return dotEnvOut
}

// console.log('[DEBUG] parsed dotenv', dotEnvOut.parsed)
