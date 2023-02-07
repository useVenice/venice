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
        viewBox="3 3 18 18"
        className={twMerge(
          'animate-spin fill-venice-green text-venice-gray-muted',
          props.className,
        )}
        aria-hidden="true">
        <path
          d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
          fill="currentColor"
        />
        <path
          d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z"
          fill="currentFill"
        />
      </svg>
      <span className="sr-only">Loading…</span>
    </div>
  )
}
