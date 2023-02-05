import type {SvgIconProps} from './SvgIcon'
import {SvgIcon} from './SvgIcon'

export function AddFilledIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M20 10a10 10 0 1 1-20 0 10 10 0 0 1 20 0Zm-9.375-4.375a.625.625 0 1 0-1.25 0v3.75h-3.75a.625.625 0 0 0 0 1.25h3.75v3.75a.625.625 0 1 0 1.25 0v-3.75h3.75a.624.624 0 1 0 0-1.25h-3.75v-3.75Z" />
    </SvgIcon>
  )
}
