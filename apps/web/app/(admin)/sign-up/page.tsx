'use client'

import {SignUp} from '@clerk/nextjs'

import {FullScreenCenter} from '@/components/FullScreenCenter'

export default function SignInScreen() {
  return (
    <FullScreenCenter>
      <SignUp signInUrl="/sign-in" />
    </FullScreenCenter>
  )
}
