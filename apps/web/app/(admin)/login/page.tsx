'use client'

import {Auth} from '@supabase/auth-ui-react'
import {ThemeSupa} from '@supabase/auth-ui-shared'
import {useMutation} from '@tanstack/react-query'

import {useSupabaseContext} from '@/contexts/supabase-context'
import {useViewerContext} from '@/contexts/viewer-context'
import {VeniceTheme} from '@/themes'

// TODO: Would be nice to populate the initial viewer state from the server
export default function AdminAuthScreen() {
  const {viewer, status} = useViewerContext()
  const {supabase} = useSupabaseContext()
  const logout = useMutation<void, Error>(async () => {
    await supabase.auth.signOut()
  })

  return (
    <div className="flex h-screen w-screen flex-col">
      <div className="m-auto max-w-xl">
        <div>{JSON.stringify({viewer, status}, null, 2)}</div>
        {status === 'loading' ? (
          <span>Loading...</span>
        ) : viewer.role === 'user' ? (
          <button onClick={() => logout.mutate()}>Log out</button>
        ) : viewer.role === 'anon' ? (
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: veniceThemeTweaks,
            }}
            localization={{
              variables: {
                // Workaround for not implementing password reset just yet...
                forgotten_password: {
                  button_label: 'Email me a magic link to sign in with',
                  link_text: 'Email me a magic link to sign in with',
                },
                sign_in: {
                  link_text: 'Sign in to an existing account',
                },
              },
            }}
            providers={['google', 'github']}
            theme="dark"></Auth>
        ) : (
          <div>Unsupported role {viewer.role}</div>
        )}
      </div>
    </div>
  )
}

const veniceThemeTweaks = {
  default: {
    colors: {
      brand: VeniceTheme._green,
      brandAccent: VeniceTheme._green,
      brandButtonText: VeniceTheme.offwhite,
      defaultButtonBackground: '#2e2e2e',
      defaultButtonBackgroundHover: '#3e3e3e',
    },
  },
}
