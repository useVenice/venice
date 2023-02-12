import {QuestionCircleIcon} from '@usevenice/ui/icons'
import {ExternalLink} from './ExternalLink'

export function HelpButton() {
  return (
    <ExternalLink
      href="https://docs.venice.is/support/contact-us"
      className="flex h-8 shrink-0 items-center gap-1 rounded bg-venice-black-500 px-2 hover:opacity-90">
      <QuestionCircleIcon className="inline-flex h-4 w-4 fill-current text-offwhite" />
      <span className="text-xs uppercase">Help</span>
    </ExternalLink>
  )
}
