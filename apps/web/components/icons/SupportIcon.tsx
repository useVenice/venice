import type {SvgIconProps} from './SvgIcon'
import {SvgIcon} from './SvgIcon'

export function SupportIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M2.5 1.25A1.25 1.25 0 0 0 1.25 2.5v10a1.25 1.25 0 0 0 1.25 1.25h11.982a2.5 2.5 0 0 1 1.768.732l2.5 2.5V2.5a1.25 1.25 0 0 0-1.25-1.25h-15ZM17.5 0A2.5 2.5 0 0 1 20 2.5v15.991a.624.624 0 0 1-1.067.442l-3.567-3.567a1.25 1.25 0 0 0-.883-.366H2.5A2.5 2.5 0 0 1 0 12.5v-10A2.5 2.5 0 0 1 2.5 0h15Z" />
      <path d="M6.25 7.5a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0Zm5 0a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0Zm5 0a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0Z" />
    </SvgIcon>
  )
}
