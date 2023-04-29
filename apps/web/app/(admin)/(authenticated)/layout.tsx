'use client'

import {OrganizationSwitcher, useAuth, UserButton} from '@clerk/nextjs'

import {NoSSR} from '@/components/NoSSR'
import {RedirectToNext13} from '@/components/RedirectTo'

export default function AuthedLayout({children}: {children: React.ReactNode}) {
  // Clerk react cannot be trusted... Add our own clerk listener instead...
  // auth works for initial request but then subsequently breaks...
  const auth = useAuth()
  // const user = useUser()
  // const orgs = useOrganizationList()

  if (auth.isLoaded && !auth.isSignedIn) {
    return <RedirectToNext13 url="/sign-in" />
  }

  // useEffect(() => {
  //   if (!auth.orgId && orgs.organizationList?.[0]) {
  //     void orgs.setActive(orgs.organizationList[0])
  //   }
  // }, [auth.orgId, orgs])
  // console.log('[AuthedLayout]', {user, auth, orgs})

  // return (
  //   <FullScreenCenter>
  //     <NoSSR>
  //       <OrganizationSwitcher hidePersonal defaultOpen />
  //     </NoSSR>
  //   </FullScreenCenter>
  // )
  // if (!auth.isLoaded) {
  //   // console.log('[AuthedLayout] auth not loaded', auth, orgs)
  //   return null
  // }
  // // if (!auth.isSignedIn) {
  // //   console.log('[AuthedLayout] redirect to sign in ')
  // //   return <RedirectToNext13 url="/sign-in" />
  // // }
  // if (!orgs.isLoaded) {
  //   // console.log('[AuthedLayout] orgs not loaded', auth, orgs)
  //   return null
  // }
  // if (!auth.orgId) {
  //   const firstOrg = orgs.organizationList?.[0]
  //   return !firstOrg ? (
  //     <FullScreenCenter>
  //       <CreateOrganization />
  //     </FullScreenCenter>
  //   ) : (
  //     <EffectContainer
  //       effect={() => {
  //         // Eventually would be nice to sync active org with URL...
  //         void orgs.setActive(firstOrg)
  //       }}
  //     />
  //   )
  // }

  return (
    <div className="h-screen w-screen">
      <div className="flex h-10 justify-between gap-2 p-2">
        {/* Not working because of bug in clerk js that is unclear that results in hydration issue.. */}
        <NoSSR>
          <OrganizationSwitcher hidePersonal />
          <UserButton />
        </NoSSR>
      </div>
      {auth.orgId ? children : <div>Create an org to begin</div>}
    </div>
  )
}
