import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@usevenice/ui'
import {supabase} from '@usevenice/web/contexts/common-contexts'
import {useSession} from '@usevenice/web/contexts/session-context'
import type {ComponentPropsWithoutRef} from 'react'

export function AccountMenu() {
  const [session] = useSession()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="inline-flex focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          aria-label="Account menu">
          {/* Somehow, we can't control size & fill with CSS. */}
          <AccountCircleFilledIcon width={32} height={32} fill="currentColor" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="border border-base-content/50 p-2 text-sm">
        <p className="p-2 text-offwhite">{session?.user.email}</p>
        <DropdownMenuItem
          onSelect={() => supabase.auth.signOut()}
          className="cursor-pointer rounded p-2 text-white outline-none hover:bg-offwhite/5 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function AccountCircleFilledIcon(props: ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
      <path d="M11.1 35.25q3.15-2 6.225-3.025Q20.4 31.2 24 31.2q3.6 0 6.7 1.025t6.25 3.025q2.2-2.7 3.125-5.45Q41 27.05 41 24q0-7.25-4.875-12.125T24 7q-7.25 0-12.125 4.875T7 24q0 3.05.95 5.8t3.15 5.45ZM24 25.5q-2.9 0-4.875-1.975T17.15 18.65q0-2.9 1.975-4.875T24 11.8q2.9 0 4.875 1.975t1.975 4.875q0 2.9-1.975 4.875T24 25.5ZM24 44q-4.2 0-7.85-1.575-3.65-1.575-6.35-4.3Q7.1 35.4 5.55 31.75 4 28.1 4 23.95q0-4.1 1.575-7.75 1.575-3.65 4.3-6.35 2.725-2.7 6.375-4.275Q19.9 4 24.05 4q4.1 0 7.75 1.575 3.65 1.575 6.35 4.275 2.7 2.7 4.275 6.35Q44 19.85 44 24q0 4.1-1.575 7.75-1.575 3.65-4.275 6.375t-6.35 4.3Q28.15 44 24 44Z" />
    </svg>
  )
}
