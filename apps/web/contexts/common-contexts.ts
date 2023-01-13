import {createClient} from '@supabase/supabase-js'

// https://app.supabase.com/project/hhnxsazpojeczkeeifli/settings/api
export const supabase = createClient(
  'https://hhnxsazpojeczkeeifli.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhobnhzYXpwb2plY3prZWVpZmxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjAyNjgwOTIsImV4cCI6MTk3NTg0NDA5Mn0.ZDmf1sjsr-UxW2bPgdj3uaqJNUSqkZh8vCB1phn3qqs',
)

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
