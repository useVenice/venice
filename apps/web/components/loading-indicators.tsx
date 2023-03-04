import {createPortal} from 'react-dom'
import * as Progress from '@radix-ui/react-progress'

// Full screen overlay with loading indicator
export function LoadingIndicatorOverlay() {
  return (
    <div className="fixed inset-0 z-[9999]">
      <LoadingIndicator />
    </div>
  )
}

interface LoadingIndicatorOverlayV2Props {
  // the container must have "postiion: relative"
  container?: Element | DocumentFragment
}

export function LoadingIndicatorOverlayV2(
  props: LoadingIndicatorOverlayV2Props,
) {
  const {container = document.body} = props
  return createPortal(
    <div className="absolute inset-0 z-[9999] bg-venice-black/70">
      <LoadingIndicator />
    </div>,
    container,
  )
}

// Indeterminate loading indicator that fills its parent & centers itself
export function LoadingIndicator() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="w-40">
        <p className="text-center text-sm text-offwhite">Loading...</p>
        <Progress.Root
          value={null}
          className="relative mt-4 h-1 w-full overflow-hidden rounded-full bg-black-400">
          <Progress.Indicator
            className="absolute h-full w-full rounded-full bg-venice-green"
            style={{
              animation: 'loading-indicator-indeterminate 2s ease-out infinite',
            }}
          />
        </Progress.Root>
      </div>
    </div>
  )
}
