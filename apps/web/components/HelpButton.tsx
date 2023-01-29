import {QuestionCircleIcon} from '../components/icons'

export function HelpButton() {
  return (
    <button className="flex h-8 shrink-0 items-center gap-1 rounded bg-venice-black-500 px-2 hover:opacity-90">
      <QuestionCircleIcon className="inline-flex h-4 w-4 fill-current text-offwhite" />
      <span className="text-xs uppercase">Help</span>
    </button>
  )
}
