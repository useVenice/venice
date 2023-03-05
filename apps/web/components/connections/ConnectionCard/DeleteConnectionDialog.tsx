import type {ZStandard} from '@usevenice/cdk-core'
import {DialogPrimitive} from '@usevenice/ui'
import {DeleteIcon} from '@usevenice/ui/icons'
import Image from 'next/image'
import {useState} from 'react'
import type {Connection} from '../../../lib/supabase-queries'
import {z} from '@usevenice/util'
import {ZodForm} from '@usevenice/ui'

const deleteFormSchema = z.object({
  deleteAssociatedData: z
    .boolean()
    .optional()
    .describe('Delete associated data?'),
})

interface DeleteConnectionDialogProps {
  institution?: ZStandard['institution'] | null
  isConnectionDeleting?: boolean
  name?: Connection['resource']['displayName']
  onCancel: () => void
  onDeletionConfirmed: (options?: {deleteAssociatedData?: boolean}) => void
}

export function DeleteConnectionDialog(props: DeleteConnectionDialogProps) {
  const {
    institution,
    isConnectionDeleting,
    name,
    onCancel,
    onDeletionConfirmed,
  } = props
  const [isDeleting, setIsDeleting] = useState(false)
  const handleDeletionConfirmed = (shouldDelete: boolean) => {
    setIsDeleting(true)
    onDeletionConfirmed({deleteAssociatedData: shouldDelete})
  }
  return (
    <DialogPrimitive.Portal>
      <div className="fixed inset-0 z-50 flex items-start justify-center sm:items-center">
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity will-change-auto animate-in fade-in" />
        <DialogPrimitive.Content className="fixed z-50 grid w-full gap-4 border border-venice-black-300 bg-venice-black-500 p-6 opacity-100 animate-in fade-in-70 focus:outline-none focus:ring-venice-black-300 sm:min-w-[35rem] sm:max-w-lg sm:rounded-lg">
          <div className="mt-2 mb-3 flex items-center justify-center gap-2">
            {institution?.logoUrl ? (
              <Image
                width={32}
                height={32}
                src={institution.logoUrl}
                alt={`${institution.name} Logo`}
              />
            ) : (
              <Image
                width={32}
                height={32}
                src="/institution-placeholder.svg"
                alt=""
                aria-hidden="true"
              />
            )}
            <span className="text-sm uppercase">{name}</span>
          </div>
          <DialogPrimitive.Title className="text-center text-venice-green">
            Are you sure you want to delete this connection?
          </DialogPrimitive.Title>
          <div className="mx-auto max-w-[20rem] text-sm text-venice-gray">
            <p className="pb-1">Deleting {name} will:</p>
            <ul className="list-disc pl-4">
              <li>stop syncing its data into Venice</li>
              <li>keep all previously synced data safely in Venice</li>
              <li>delete this connection with {name}</li>
            </ul>
          </div>

          <div className="mx-auto">
            <ZodForm
              schema={deleteFormSchema as any}
              onSubmit={(values) => {
                const submittedValues = deleteFormSchema.parse(values)
                handleDeletionConfirmed(
                  submittedValues.deleteAssociatedData ?? false,
                )
              }}
              renderAfter={({submit}) => (
                <div className="mt-12 flex justify-center gap-4">
                  <button
                    onClick={onCancel}
                    disabled={isDeleting || isConnectionDeleting}
                    className="min-w-[6rem] rounded-lg px-3 py-2 text-sm text-offwhite ring-1 ring-inset ring-venice-black-400 transition-colors hover:bg-venice-black-400 focus:outline-none focus-visible:bg-venice-black-400 disabled:opacity-30">
                    Cancel
                  </button>
                  <button
                    onClick={submit}
                    disabled={isDeleting || isConnectionDeleting}
                    className="flex min-w-[6rem] items-center gap-2 rounded-lg bg-venice-red px-3 py-2 text-sm text-offwhite hover:bg-[#ac2039] focus:outline-none focus-visible:bg-[#ac2039] disabled:opacity-30 disabled:hover:bg-venice-red">
                    <DeleteIcon className="h-4 w-4 fill-current" />
                    {isConnectionDeleting ? (
                      <span>Deleting…</span>
                    ) : (
                      <span>Delete</span>
                    )}
                  </button>
                </div>
              )}
            />
          </div>
        </DialogPrimitive.Content>
      </div>
    </DialogPrimitive.Portal>
  )
}
