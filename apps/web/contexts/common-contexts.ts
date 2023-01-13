import {createClient} from '@supabase/supabase-js'

// https://app.supabase.com/project/hhnxsazpojeczkeeifli/settings/api
export const supabase = createClient(
  'https://hhnxsazpojeczkeeifli.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhobnhzYXpwb2plY3prZWVpZmxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjAyNjgwOTIsImV4cCI6MTk3NTg0NDA5Mn0.ZDmf1sjsr-UxW2bPgdj3uaqJNUSqkZh8vCB1phn3qqs',
)
