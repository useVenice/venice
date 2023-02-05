import type {SvgIconProps} from './SvgIcon'
import {SvgIcon} from './SvgIcon'

export function CloseIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M2.683 3.567a.626.626 0 0 1 .885-.885L10 9.117l6.433-6.433a.626.626 0 1 1 .884.885L10.884 10l6.433 6.433a.627.627 0 0 1-.884.884L10 10.884l-6.433 6.433a.627.627 0 0 1-.885-.884L9.117 10 2.683 3.567Z" />
    </SvgIcon>
  )
}
