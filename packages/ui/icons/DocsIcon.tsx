import type {SvgIconProps} from './SvgIcon'
import {SvgIcon} from './SvgIcon'

export function DocsIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M1.25 3.535c1.106-.463 2.692-.961 4.235-1.116 1.662-.168 3.072.079 3.89.94V15.54c-1.169-.662-2.65-.754-4.016-.616-1.475.15-2.963.576-4.109 1.014V3.535Zm9.375-.176c.818-.861 2.227-1.108 3.89-.94 1.543.155 3.129.653 4.235 1.116v12.404c-1.148-.438-2.634-.865-4.109-1.013-1.367-.139-2.847-.049-4.016.615V3.36ZM10 2.229C8.769 1.17 6.984 1.012 5.359 1.175c-1.893.191-3.803.84-4.993 1.381A.625.625 0 0 0 0 3.125v13.75a.625.625 0 0 0 .884.569c1.102-.5 2.879-1.101 4.6-1.275 1.761-.178 3.237.108 4.028 1.096a.625.625 0 0 0 .976 0c.79-.988 2.267-1.274 4.027-1.096 1.723.174 3.5.775 4.601 1.275a.625.625 0 0 0 .884-.569V3.125a.625.625 0 0 0-.366-.569c-1.19-.541-3.1-1.19-4.993-1.381-1.625-.164-3.41-.005-4.641 1.054Z" />
    </SvgIcon>
  )
}
