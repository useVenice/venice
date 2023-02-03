import {DialogPrimitive as Dialog} from '@usevenice/ui'
import {AddFilledIcon} from '../icons'
import {ResourceCard} from '../ResourceCard'
import {AddSourceDialog} from './AddSourceDialog'

export function AddSourceCard() {
  return (
    <Dialog.Root>
      <ResourceCard
        tagColor="offwhite"
        bgColor="bg-gradient-to-r from-[#ECAA47] to-[#722273]">
        <div className="grid place-items-center px-6 py-4">
          <Dialog.Trigger asChild>
            <button className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-offwhite hover:bg-venice-black/10 focus:outline-none focus-visible:bg-venice-black/10">
              <AddFilledIcon className="inline-flex h-5 w-5 fill-current" />
              <span className="text-sm uppercase">Add new source</span>
            </button>
          </Dialog.Trigger>
        </div>
      </ResourceCard>
      <AddSourceDialog />
    </Dialog.Root>
  )
}
