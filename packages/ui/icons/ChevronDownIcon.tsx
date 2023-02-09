import type {SvgIconProps} from './SvgIcon'
import {SvgIcon} from './SvgIcon'

export function ChevronDownIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M2.058 5.808a.625.625 0 0 1 .885 0L10 12.866l7.058-7.058a.626.626 0 1 1 .884.885l-7.5 7.5a.625.625 0 0 1-.885 0l-7.5-7.5a.625.625 0 0 1 0-.885Z" />
    </SvgIcon>
  )
}
