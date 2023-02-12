import {TabsPrimitive as Tabs} from '@usevenice/ui'

interface PrimaryTabsProps<K> {
  options: Array<{key: K; label: string}>
}

export function PrimaryTabs<K extends string>(props: PrimaryTabsProps<K>) {
  return (
    <Tabs.List className="flex gap-6">
      {props.options.map(({key, label}) => (
        <Tabs.Trigger
          key={key}
          value={key}
          className="rounded-t border-b-2 border-transparent py-1 text-sm uppercase tracking-wide text-venice-gray hover:text-offwhite focus:outline-none data-[state=active]:border-venice-green data-[state=active]:text-offwhite">
          {label}
        </Tabs.Trigger>
      ))}
    </Tabs.List>
  )
}
