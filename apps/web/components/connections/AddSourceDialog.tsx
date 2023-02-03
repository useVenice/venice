import {DialogPrimitive as Dialog} from '@usevenice/ui'

// TEMPORARY - add Plaid Oauth iframe
export function AddSourceDialog() {
  return (
    <Dialog.Portal>
      <div className="fixed inset-0 z-50 flex items-start justify-center sm:items-center">
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity" />
        <Dialog.Content className="fixed z-50 grid w-full scale-100 gap-4 bg-venice-black-500 p-6 opacity-100 focus:outline-none focus:ring-venice-black-300 sm:max-w-lg sm:rounded-lg">
          <Dialog.Title>Add source</Dialog.Title>
          <Dialog.Description>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias
            dolorem sint minima aliquid, commodi temporibus nulla voluptatem
            accusantium iure laboriosam distinctio esse nam omnis magnam
            quibusdam velit deserunt repellendus aliquam?
          </Dialog.Description>
        </Dialog.Content>
      </div>
    </Dialog.Portal>
  )
}
