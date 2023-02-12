import type {SvgIconProps} from './SvgIcon'
import {SvgIcon} from './SvgIcon'

export function CircleFilledIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <circle cx="10" cy="10" r="10" />
    </SvgIcon>
  )
}
