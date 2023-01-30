import type {SvgIconProps} from './SvgIcon'
import {SvgIcon} from './SvgIcon'

export function ExportIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M1.25 10a8.75 8.75 0 1 0 17.5 0 8.75 8.75 0 0 0-17.5 0ZM20 10a10 10 0 1 1-20 0 10 10 0 0 1 20 0ZM7.317 13.504a.625.625 0 0 1-.885-.884l5.122-5.12h-3.46a.625.625 0 0 1 0-1.25h4.969a.625.625 0 0 1 .624.625v4.969a.625.625 0 1 1-1.25 0v-3.46l-5.12 5.12Z" />
    </SvgIcon>
  )
}
