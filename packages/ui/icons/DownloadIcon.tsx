import type {SvgIconProps} from './SvgIcon'
import {SvgIcon} from './SvgIcon'

export function DownloadIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M.625 12.375A.625.625 0 0 1 1.25 13v3.125a1.25 1.25 0 0 0 1.25 1.25h15a1.25 1.25 0 0 0 1.25-1.25V13A.624.624 0 1 1 20 13v3.125a2.5 2.5 0 0 1-2.5 2.5h-15a2.5 2.5 0 0 1-2.5-2.5V13a.625.625 0 0 1 .625-.625Z" />
      <path d="M9.557 14.818a.625.625 0 0 0 .886 0l3.75-3.75a.626.626 0 1 0-.886-.886l-2.682 2.684V1.875a.625.625 0 0 0-1.25 0v10.991l-2.683-2.684a.626.626 0 1 0-.885.886l3.75 3.75Z" />
    </SvgIcon>
  )
}
