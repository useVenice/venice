import {CircleFilledIcon, MoreIcon} from '../../icons'
import {ResourceCard} from '../../ResourceCard'

export function SourceCardSkeleton() {
  return (
    <ResourceCard tagColor="venice-gray">
      <div className="flex grow animate-pulse flex-col justify-between py-2 px-3">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-venice-gray-muted" />
          <div className="h-4 w-[6rem] rounded bg-venice-gray-muted" />
          <DisabledActionMenu />
        </div>
        <div className="flex flex-col items-end gap-2">
          <p className="inline-flex items-center gap-1">
            <CircleFilledIcon className="h-2 w-2 fill-current text-venice-gray-muted" />
            <span className="flex h-2 w-[4rem] rounded-sm bg-venice-gray-muted" />
          </p>
          <div className="inline-flex h-2 w-[7rem] rounded-sm bg-venice-gray-muted" />
        </div>
      </div>
    </ResourceCard>
  )
}

function DisabledActionMenu() {
  return (
    <button className="pointer-events-none rounded-full p-1">
      <MoreIcon className="h-3.5 w-3.5 fill-current text-venice-gray-muted" />
    </button>
  )
}
