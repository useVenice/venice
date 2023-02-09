import type {SvgIconProps} from './SvgIcon'
import {SvgIcon} from './SvgIcon'

export function CopyTextIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M16.667 7.5h-7.5c-.92 0-1.667.746-1.667 1.667v7.5c0 .92.746 1.666 1.667 1.666h7.5c.92 0 1.666-.746 1.666-1.666v-7.5c0-.92-.746-1.667-1.666-1.667Z" />
      <path d="M2.688 12.845c.313.313.737.488 1.179.488h.724a1 1 0 0 0 1-1V7.956a2.5 2.5 0 0 1 2.522-2.5l4.42.04c.276.002.5-.22.5-.496v-.833A1.667 1.667 0 0 0 11.367 2.5h-7.5A1.667 1.667 0 0 0 2.2 4.167v7.5c0 .442.176.866.488 1.178Z" />
    </SvgIcon>
  )
}
