import type {SvgIconProps} from './SvgIcon'
import {SvgIcon} from './SvgIcon'

export function BankIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M10.346.105a.625.625 0 0 0-.692 0L.279 6.355A.625.625 0 0 0 .625 7.5h2.344v8.75H1.875a.625.625 0 0 0 0 1.25h16.25a.625.625 0 1 0 0-1.25h-1.094V7.5h2.344a.625.625 0 0 0 .346-1.145L10.346.105ZM15.47 7.5v8.75h-1.563V7.5h1.563Zm-3.125 0v8.75H10.78V7.5h1.563Zm-3.125 0v8.75H7.656V7.5H9.22Zm-3.125 0v8.75H4.53V7.5h1.563ZM10 5a1.25 1.25 0 1 1 0-2.5A1.25 1.25 0 0 1 10 5ZM.625 18.75a.625.625 0 0 0 0 1.25h18.75a.625.625 0 1 0 0-1.25H.625Z" />
    </SvgIcon>
  )
}
