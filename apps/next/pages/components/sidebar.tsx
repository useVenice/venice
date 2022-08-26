import {HStack, Menu, MenuItem, ProSidebar} from '@ledger-sync/app-ui'
import {useTheme} from 'next-themes'
import Link from 'next/link'
import {useRouter} from 'next/router'
import React from 'react'

function SideBar({workspace}: {workspace: string}) {
  return (
    <ProSidebar style={{height: '100vh'}} width="200px" collapsed={false}>
      <Menu style={{paddingTop: 30}} iconShape="square">
        <Link href={`/workspaces/${workspace}/integrations`}>
          <MenuItem>Integrations</MenuItem>
        </Link>
        <Link href={`/workspaces/${workspace}/connections`}>
          <MenuItem>Connections</MenuItem>
        </Link>
        <Link href={`/workspaces/${workspace}/pipelines`}>
          <MenuItem>Pipelines</MenuItem>
        </Link>
        <Link href={`/workspaces/${workspace}/settings`}>
          <MenuItem>Settings</MenuItem>
        </Link>
      </Menu>
    </ProSidebar>
  )
}

export default function LayoutSidebar({
  children,
}: {
  children: React.ReactChild
}) {
  const router = useRouter()
  const {workspace} = router.query
  const {theme, systemTheme} = useTheme()
  return (
    <>
      <style>{`
       th, td{
       border:1px solid ${
         theme === 'dark' || systemTheme === 'dark' ? 'white' : 'black'
       }; 
      }
      tr {
        text-align: center;
      }
    `}</style>
      <HStack>
        {workspace ? <SideBar workspace={workspace as string} /> : <></>}
        {children}
      </HStack>
    </>
  )
}
