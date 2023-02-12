import type {ComponentType, PropsWithChildren} from 'react'
import type {SvgIconProps} from '../icons'
import {Card} from './Card'

export type InstructionCardProps = PropsWithChildren<{
  icon: ComponentType<SvgIconProps>
  title: string
}>

// InstructionCard provides standard styling for a card with content
// that provide instruction/information to users.
export function InstructionCard(props: InstructionCardProps) {
  const {children, icon: Icon, title} = props
  return (
    <Card>
      <div className="grid gap-6 p-6">
        <h2 className="grid grid-cols-[auto_1fr] items-center gap-2">
          <Icon className="h-5 w-5 fill-venice-gray-muted" />
          <span className="text-base text-offwhite">{title}</span>
        </h2>
        {/* padding left match header's icon size + gap */}
        <div className="grid gap-4 pl-7 text-sm text-venice-gray">
          {children}
        </div>
      </div>
    </Card>
  )
}
