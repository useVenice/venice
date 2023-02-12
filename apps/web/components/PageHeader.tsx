import type {PropsWithChildren} from 'react'
import {Fragment} from 'react'
import {HelpButton} from './HelpButton'

type MainContentLayoutProps = PropsWithChildren<{
  title: string[]
}>

export function PageHeader({title}: MainContentLayoutProps) {
  return (
    <header className="flex items-center border-b border-venice-black-300 py-2 px-4">
      <h1 className="flex grow items-center gap-2 text-sm font-medium uppercase">
        {title.map((part, i) => (
          <Fragment key={part}>
            {i > 0 ? <TitleSeparator /> : null}
            {part}
          </Fragment>
        ))}
      </h1>
      <HelpButton />
    </header>
  )
}

function TitleSeparator() {
  return (
    <i className="inline-flex text-xs text-venice-black-300 before:content-['/']" />
  )
}
