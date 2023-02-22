import {createPortal} from 'react-dom'

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
        <progress className="progress progress-primary mt-4"></progress>
      </div>
    </div>
  )
}
