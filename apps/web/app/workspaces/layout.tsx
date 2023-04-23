import {ClientRoot} from '../ClientRoot'
import '../global.css'

export default function Layout({children}: {children: React.ReactNode}) {
  return (
    <div className="h-screen w-screen bg-black text-offwhite" data-theme="dark">
      <ClientRoot>{children}</ClientRoot>
    </div>
  )
}
