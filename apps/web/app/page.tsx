import {redirect} from 'next/navigation'

export default function Home() {
  redirect('/admin/auth')
  // return (
  //   <h1>
  //     Your Venice deployment is successful. See docs for details on how to use
  //     it
  //   </h1>
  // )
}
