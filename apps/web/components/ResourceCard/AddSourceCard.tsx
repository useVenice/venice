import {AddFilledIcon} from '../icons'
import {ResourceCard} from './ResourceCard'

interface Props {
  onClick?: () => void
}

export function AddSourceCard(props: Props) {
  return (
    <ResourceCard
      tagColor="offwhite"
      bgColor="bg-gradient-to-r from-[#ECAA47] to-[#722273]">
      <div className="grid place-items-center px-6 py-4">
        <button
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-offwhite hover:bg-venice-black/10 focus:outline-none focus-visible:bg-venice-black/10"
          onClick={props.onClick}>
          <AddFilledIcon className="inline-flex h-5 w-5 fill-current" />
          <span className="text-sm uppercase">Add new source</span>
        </button>
      </div>
    </ResourceCard>
  )
}
