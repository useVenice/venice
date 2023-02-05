import clsx from 'clsx'
import type {PropsWithChildren} from 'react'

type TagColor = keyof typeof tagColorMap
type ResourceCardProps = PropsWithChildren<{
  tagColor: TagColor
  // tailwind bg- classname
  bgColor?: string
}>

export function ResourceCard(props: ResourceCardProps) {
  const {bgColor = 'bg-venice-black-400', children, tagColor} = props
  return (
    <div
      className={clsx(
        'relative min-h-[6.5rem] overflow-hidden rounded-lg ring-1 ring-inset ring-venice-black-300',
        // allow children to fill the height or align vertically center
        'grid',
        bgColor,
      )}>
      <Tag tagColor={tagColor} />
      {children}
    </div>
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
