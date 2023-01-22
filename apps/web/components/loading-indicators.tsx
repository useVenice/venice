// Full screen overlay with loading indicator
export function LoadingIndicatorOverlay() {
  return (
    <div className="fixed inset-0 z-[9999]">
      <LoadingIndicator />
    </div>
  )
}

// Indeterminate loading indicator that fills its parent & centers itself
export function LoadingIndicator() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="w-24">
        <p className="text-center text-sm text-offwhite">Loading...</p>
        <progress className="progress progress-primary mt-4"></progress>
      </div>
    </div>
  )
}
