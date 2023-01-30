import type {ComponentPropsWithoutRef} from 'react'

type SvgProps = ComponentPropsWithoutRef<'svg'>
export type SvgIconProps = Omit<SvgProps, 'children'>

export function SvgIcon(props: SvgProps) {
  return (
    <svg
      aria-hidden="true"
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
    />
  )
}
