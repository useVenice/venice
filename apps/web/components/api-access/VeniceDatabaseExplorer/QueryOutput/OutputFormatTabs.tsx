import {TabsPrimitive} from '@usevenice/ui'

interface OutputFormatTabsProps<K> {
  options: Array<{key: K; label: string}>
}

export function OutputFormatTabs<K extends string>(
  props: OutputFormatTabsProps<K>,
) {
  return (
    <TabsPrimitive.List className="flex rounded-lg bg-venice-black-500 text-sm ring-1 ring-inset ring-venice-black-300">
      {props.options.map(({key, label}) => (
        <TabsPrimitive.Trigger
          key={key}
          value={key}
          className="h-8 rounded-lg px-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-offwhite/70 data-[state=active]:bg-venice-green-btn">
          {label}
        </TabsPrimitive.Trigger>
      ))}
    </TabsPrimitive.List>
  )
}
