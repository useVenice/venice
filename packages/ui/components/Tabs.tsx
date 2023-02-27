import * as TabsPrimitive from '@radix-ui/react-tabs'

export {Tabs, TabsContent} from '@radix-ui/react-tabs'
// use TabsPrimitive when you need to build something custom
export {TabsPrimitive}

interface TabsTriggersProps<K> {
  options: Array<{key: K; label: string}>
}

export function TabsTriggers<K extends string>(props: TabsTriggersProps<K>) {
  return (
    <TabsPrimitive.List className="flex gap-6">
      {props.options.map(({key, label}) => (
        <TabsPrimitive.Trigger
          key={key}
          value={key}
          className="flex-none rounded-t border-b-2 border-transparent py-1 text-sm uppercase tracking-wide text-venice-gray hover:text-offwhite focus:outline-none data-[state=active]:border-venice-green data-[state=active]:text-offwhite">
          {label}
        </TabsPrimitive.Trigger>
      ))}
    </TabsPrimitive.List>
  )
}
