// @next/env has been patched to use 'find-config' to load from parent
import {loadEnvConfig} from '@next/env'

/**
 * Vercel uses dotenv expand by default.. Really not great in case of a password with $
 * @see https://github.com/vercel/vercel/discussions/4391
 * Really tempted to just do our own .env parsing... Or otherwise patching it...
 */
export function loadEnv() {
  if (process.env['SKIP_DOTENV']) {
    return {}
  }
  const loaded = loadEnvConfig('./')
  return loaded.combinedEnv as Record<string, string>
}

// console.log('[DEBUG] parsed dotenv', dotEnvOut.parsed)
