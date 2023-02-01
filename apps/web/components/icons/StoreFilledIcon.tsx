import type {SvgIconProps} from './SvgIcon'
import {SvgIcon} from './SvgIcon'

export function StoreFilledIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M4 5.5V4h12v1.5Zm0 11V12H3v-1.5l1-4h12l1 4V12h-1v4.5h-1.5V12H11v4.5ZM5.5 15h4v-3h-4Z" />
    </SvgIcon>
  )
}
