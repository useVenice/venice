import type {RefObject} from 'react'
import {useEffect, useRef, useCallback} from 'react'

export function useOnClickOutside(
  targetElementRef: RefObject<HTMLElement | null>,
  handler: (event: Event) => void,
): void {
  const savedHandler = useRef(handler)
  // keep reference to handler up-to-date but don't re-create
  // handleClick so we don't re-mount everytime handler changes
  useEffect(() => {
    savedHandler.current = handler
  }, [handler])

  const el = targetElementRef?.current
  const handleClick = useCallback(
    (event: Event) => {
      const {target} = event
      if (target instanceof Node && el && !el.contains(target)) {
        // handler(event)
        savedHandler.current(event)
      }
    },
    [el],
  )

  useEffect(() => {
    document.addEventListener('click', handleClick, true)
    document.addEventListener('ontouchstart', handleClick, true)
    return () => {
      document.removeEventListener('click', handleClick, true)
      document.removeEventListener('ontouchstart', handleClick, true)
    }
  }, [handleClick])
}
