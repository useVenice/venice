'use client'

import {SignIn} from '@clerk/nextjs'

export default function SignInScreen() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <SignIn signUpUrl="/sign-up" />
    </div>
  )
}
