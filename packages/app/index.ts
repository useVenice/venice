import {Constants} from '@ledger-sync/app-config'
import {createClient} from '@supabase/supabase-js'

export const supabase = createClient(
  Constants.supabaseUrl,
  Constants.supabaseAnonKey,
)
;(globalThis as any).supabase = supabase

export {createClient} from '@supabase/supabase-js'

export * as schema from './schema'
