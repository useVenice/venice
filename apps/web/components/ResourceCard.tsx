import type {CardProps} from '@usevenice/ui'
import {Card} from '@usevenice/ui'
import clsx from 'clsx'
import type {PropsWithChildren} from 'react'

type TagColor = keyof typeof tagColorMap
type ResourceCardProps = PropsWithChildren<{
  tagColor: TagColor
  // tailwind bg- classname
  bgColor?: CardProps['bgColor']
}>

export function ResourceCard(props: ResourceCardProps) {
  const {bgColor = 'bg-venice-black-400', children, tagColor} = props
  return (
    <Card bgColor={bgColor}>
      <div
        className={clsx(
          'relative min-h-[7.5rem] rounded-lg',
          // allow children to fill the height or align vertically center
          'grid',
        )}>
        <Tag tagColor={tagColor} />
        {children}
      </div>
    </Card>
  )
}

interface TagProps {
  tagColor: TagColor
}

function Tag(props: TagProps) {
  const {tagColor} = props
  return (
    <i
      className={clsx(
        'absolute inset-y-0 left-0 z-10 w-1',
        tagColorMap[tagColor],
      )}
    />
  )
}

// we need to list out the values statically (no template literal)
// so tailwind can generate the associated utility classes
const tagColorMap = {
  offwhite: 'bg-offwhite',
  'venice-gold': 'bg-venice-gold',
  'venice-gray': 'bg-venice-gray',
  'venice-green': 'bg-venice-green',
  'venice-red': 'bg-venice-red',
}
