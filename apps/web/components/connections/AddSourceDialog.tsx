import {DialogPrimitive as Dialog} from '@usevenice/ui'
import {NewPipelineInScreen} from '../NewPipelineInScreen'
import type {ConnectWith} from '@usevenice/cdk-core'

export function AddSourceDialog(props: {connectWith?: ConnectWith}) {
  return (
    <Dialog.Portal>
      <div className="fixed inset-0 z-50 flex items-start justify-center sm:items-center">
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity will-change-auto animate-in fade-in" />
        <Dialog.Content className="fixed z-50 grid w-full gap-4 bg-venice-black-500 p-6 opacity-100 animate-in fade-in-70 focus:outline-none focus:ring-venice-black-300 sm:max-w-lg sm:rounded-lg">
          <NewPipelineInScreen connectWith={props.connectWith} />
        </Dialog.Content>
      </div>
    </Dialog.Portal>
  )
}
