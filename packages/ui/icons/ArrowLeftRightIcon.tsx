import type {SvgIconProps} from './SvgIcon'
import {SvgIcon} from './SvgIcon'

export function ArrowLeftRightIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M1.25 14.375a.625.625 0 0 0 .625.625h14.741l-3.934 3.933a.626.626 0 1 0 .886.884l5-5a.625.625 0 0 0 0-.885l-5-5a.626.626 0 0 0-.886.886l3.934 3.932H1.875a.625.625 0 0 0-.625.625Zm17.5-8.75a.625.625 0 0 1-.625.625H3.384l3.933 3.932a.626.626 0 1 1-.885.886l-5-5a.625.625 0 0 1 0-.885l5-5a.626.626 0 0 1 .885.884L3.385 5h14.741a.625.625 0 0 1 .625.625Z" />
    </SvgIcon>
  )
}
