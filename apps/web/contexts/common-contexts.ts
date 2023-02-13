import {createBrowserSupabaseClient} from '@supabase/auth-helpers-nextjs'
// import {commonEnv} from '@usevenice/app-config/commonConfig'
import type {Database} from '../supabase/supabase.gen'

// https://app.supabase.com/project/hhnxsazpojeczkeeifli/settings/api
export const browserSupabase = createBrowserSupabaseClient<Database>({
  // supabaseUrl: commonEnv.NEXT_PUBLIC_SUPABASE_URL,
  // supabaseKey: commonEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  // @see https://github.com/supabase/auth-helpers/pull/449
  // auth: {autoRefreshToken: true}, // auth-helpers-nextjs does not allow passing options to auth: at the moment
})
;(globalThis as any).supabaseBrowser = browserSupabase

export async function copyToClipboard(content: string) {
  console.debug('Will save to clipboard', content)

  // Workaround https://stackoverflow.com/questions/51805395/navigator-clipboard-is-undefined
  if (typeof navigator.clipboard === 'undefined') {
    console.debug('Will use textarea hack to copy text')
    const textarea = document.createElement('textarea')
    textarea.value = content
    textarea.style.position = 'fixed' // avoid scrolling to bottom
    document.body.append(textarea)
    textarea.focus()
    textarea.select()
    try {
      document.execCommand('copy')
    } catch {
      console.warn('Unable to use textarea hack to copy')
    }
    textarea.remove()
  } else {
    await navigator.clipboard.writeText(content)
  }
}
