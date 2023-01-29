import type {SvgIconProps} from './SvgIcon'
import {SvgIcon} from './SvgIcon'

export function ProfileIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M13.75 7.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
      <path d="M0 10a10 10 0 1 1 20 0 10 10 0 0 1-20 0Zm10-8.75a8.75 8.75 0 0 0-6.835 14.213C4.053 14.033 6.006 12.5 10 12.5c3.994 0 5.946 1.531 6.835 2.963A8.75 8.75 0 0 0 10 1.25Z" />
    </SvgIcon>
  )
}
