import {twMerge} from 'tailwind-merge'

interface CircularProgressProps {
  // pass fill-{color} to change the indicator color
  // pass text-{color} to change the track color
  className?: string
}

export function CircularProgress(props: CircularProgressProps) {
  return (
    <div role="status">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 18 18"
        className={twMerge(
          'animate-spin fill-venice-green text-venice-black-400',
          props.className,
        )}
        aria-hidden="true">
        <path
          fill="currentColor"
          d="M9 3.357a5.643 5.643 0 1 0 0 11.286A5.643 5.643 0 0 0 9 3.357ZM5.693 1.015a8.643 8.643 0 1 1 6.614 15.97 8.643 8.643 0 0 1-6.614-15.97Z"
        />
        <path
          fill="currentFill"
          d="M9.883 3.427A5.643 5.643 0 0 0 5.01 5.01a1.5 1.5 0 0 1-2.121-2.121 8.643 8.643 0 1 1 7.463 14.647 1.5 1.5 0 0 1-.47-2.963 5.643 5.643 0 0 0 0-11.146Z"
        />
      </svg>
      <span className="sr-only">Loading…</span>
    </div>
  )
}
