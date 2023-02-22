import {useMutation} from '@tanstack/react-query'
import type {Id} from '@usevenice/cdk-core'
import {CircularProgress} from '@usevenice/ui'
import {delay} from '@usevenice/util'
import {CloseIcon} from '@usevenice/ui/icons'
import clsx from 'clsx'
import {useEffect, useRef, useState} from 'react'
import {browserSupabase} from '../../../contexts/common-contexts'
import {useOnClickOutside} from '../../../hooks/useOnClickOutside'

interface EditingDisplayNameProps {
  displayName: string
  onCancel: () => void
  onUpdateSuccess: () => void
  resourceId: Id['reso']
}

export function EditingDisplayName(props: EditingDisplayNameProps) {
  const {onCancel, onUpdateSuccess, resourceId} = props
  const [displayName, setDisplayName] = useState(props.displayName)

  const {mutate: updateDisplayName, isLoading: isUpdating} = useMutation(
    async () => {
      const {error} = await browserSupabase
        .from('resource')
        .update({display_name: displayName})
        .eq('id', resourceId)

      if (error) {
        throw new Error(error.message)
      }
      return undefined
    },
    {
      mutationKey: ['resource', 'update', resourceId],
      onSuccess: async () => {
        // await onConnectionsMutated()
        // How do we wait for refetch success? Or is it better to optimistic update?
        await delay(500) // In pace of onConnectionsMutated() for now
        onUpdateSuccess()
      },
      // TEMPORARY
      onError: console.error,
    },
  )

  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    // HACK: don't know why but doing it sync or with 0 timeout doesn't work
    // using autoFocus props on input also doesn't work. It might have
    // something to do with radix dropdown focus management.
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [inputRef])

  // pass only the mutate function to the effect below rather than
  // the entire mutation object to avoid the effect being re-mount
  // for each change to displayName.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (isUpdating) {
        return
      }
      switch (event.key) {
        case 'Escape':
          onCancel()
          break
        case 'Enter':
          updateDisplayName({})
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isUpdating, onCancel, updateDisplayName])

  useOnClickOutside(inputRef, () => updateDisplayName({}))

  return (
    <div
      className={clsx(
        'relative flex grow items-center gap-2 rounded bg-venice-black px-2 py-1 focus-within:ring-1 focus-within:ring-inset',
        isUpdating
          ? 'focus-within:ring-venice-green/50'
          : 'focus-within:ring-venice-green',
      )}>
      <input
        ref={inputRef}
        value={displayName}
        onChange={(event) => setDisplayName(event.target.value)}
        className={clsx(
          'grow appearance-none bg-transparent text-sm focus:outline-none',
          isUpdating ? 'text-offwhite/70' : 'text-offwhite',
        )}
        disabled={isUpdating}
      />
      {isUpdating ? (
        <CircularProgress className="h-3 w-3 fill-offwhite text-offwhite/50" />
      ) : (
        <CloseButton onClick={onCancel} />
      )}
    </div>
  )
}

interface CloseButtonProps {
  onClick: () => void
}

function CloseButton(props: CloseButtonProps) {
  return (
    <button
      className="h-4 w-4 shrink-0 rounded-full fill-current p-1 text-white hover:bg-offwhite/20 focus:outline-none focus-visible:bg-offwhite/20"
      onClick={props.onClick}>
      <CloseIcon />
    </button>
  )
}
