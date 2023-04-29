'use client'

import {SignUp} from '@clerk/nextjs'

export default function SignInScreen() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <SignUp signInUrl="/sign-in" />
    </div>
  )
}
