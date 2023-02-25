import type {SvgIconProps} from './SvgIcon'
import {SvgIcon} from './SvgIcon'

export function EmailIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path
        fill="#EAEAEA"
        d="M.063 4.444A2.5 2.5 0 0 1 2.5 2.5h15a2.5 2.5 0 0 1 2.438 1.944L10 10.518.062 4.444ZM0 5.87v8.88l7.254-4.447L0 5.87Zm8.451 5.166L.24 16.072A2.5 2.5 0 0 0 2.5 17.5h15a2.5 2.5 0 0 0 2.26-1.43l-8.213-5.034-1.547.947-1.549-.947v.002Zm4.295-.732L20 14.751v-8.88l-7.254 4.433v.001Z"
      />
    </SvgIcon>
  )
}
