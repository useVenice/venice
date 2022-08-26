// import HotglueConfig from '@hotglue/widget'
import {Connections, useHotglue} from '@hotglue/widget'
import {schema, supabase, useRealtime} from '@ledger-sync/app'
import {
  Auth,
  HStack,
  Text,
  ThemeToggle,
  toast,
  Toaster,
  VStack,
} from '@ledger-sync/app-ui'
// eslint-disable-next-line import/no-extraneous-dependencies
import {Button, IconDelete, Input} from '@supabase/ui'
import Head from 'next/head'
import {useRouter} from 'next/router'
import React, {useState} from 'react'
// import {syncHooks} from './_app'


import dynamic from 'next/dynamic'
const HotglueConfig = dynamic(() => import('@hotglue/widget'), { ssr: false })


export function WorkspaceList() {
  const [res, refetch] = useRealtime<schema.WorkspaceReadT>('workspace', {})
  return (
    <VStack>
      {res.data?.map((w) => (
        <HStack>
          <Text key={w.id}>
            {w.id} {w.name}
          </Text>
          <Button
            icon={IconDelete}
            onClick={() =>
              supabase
                .from('workspace')
                .delete()
                .match({id: w.id})
                .then((deleteRes) => {
                  console.log('deleted?', deleteRes)
                })
            }>
            Delete
          </Button>
        </HStack>
      ))}
      <Button onClick={() => refetch()}>Refetch</Button>
    </VStack>
  )
}

export function CreateWorkspaceForm() {
  const [workspaceName, setWorkspaceName] = useState('')
  const {user} = Auth.useUser()
  if (!user) {
    return null
  }

  return (
    <VStack>
      <Input
        label="Workspace name"
        value={workspaceName}
        onChange={(e) => setWorkspaceName(e.target.value)}></Input>
      <Button
        onClick={async () => {
          toast(`create workspace with name ${workspaceName}`)
          const res = await supabase.rpc('create_workspace', {
            name: workspaceName,
          })
          console.log('res', res)
          // const {data, error} = await supabase
          //   .from<schema.WorkspaceWriteT>('workspace')
          //   .insert(
          //     {
          //       name: workspaceName,
          //     },
          //     {returning: 'minimal'},
          //   )
          // console.log('data inserted', data)
          // await supabase
          //   .from<schema.WorkspaceUserWriteT>('workspace_user')
          //   .insert({
          //     role: 'owner',
          //     workspace_id: data?.[0]?.id,
          //     user_id: user.id,
          //   })
        }}>
        Create workspace
      </Button>
    </VStack>
  )
}

export function LinkUI() {
  // const ls = syncHooks.useConnect()
  const {openWidget} = useHotglue()

  return (
    <VStack css={{alignItems: 'center'}}>
      {/* <Button css={{marginBottom: '$2'}} onClick={ls.showConnect}>
        Connect
      </Button> */}

      <Button css={{marginBottom: '$2'}} onClick={() => openWidget()}>
        HotGlue Connect
      </Button>
      <Connections tenant="test-user" />
    </VStack>
  )
}

export default function Home() {
  const {user} = Auth.useUser()

  const router = useRouter()
  return (
    <>
      <Head>
        <title>LedgerSync Link Demo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <VStack
        gap="md"
        css={{
          width: '100%',
          height: '100%',
          maxWidth: '$bpsm',
          maxHeight: '100vh',
          marginX: 'auto',
        }}>
        <HStack justify="between" align="center" gap="md" css={{padding: '$4'}}>
          <Text as={'h1' as any} size="3xl">
            LedgerSync Link
          </Text>
          <Button
            onClick={() => {
              // Not sure how to navigate to 'workspaces' screen,
              // for now use this for testing purposes
              router.push('/workspaces')
            }}>
            See workspaces
          </Button>

          <ThemeToggle />
        </HStack>
        <HotglueConfig
          config={{
            apiKey: 'fuy1XpXlbb1EEDg8uJBzUSW1eXSjQdY7AWuaLwN8',
            envId: 'dev.nelp.hotglue.alka.app',
          }}>
          <LinkUI />
        </HotglueConfig>

        <VStack>
          {user ? (
            <>
              <Text>
                Logged in as {user?.email} {user?.id}
              </Text>
              <Button onClick={() => supabase.auth.signOut()}>Logout</Button>
              <CreateWorkspaceForm />
              <WorkspaceList />
            </>
          ) : (
            <Auth supabaseClient={supabase} />
          )}
        </VStack>
      </VStack>

      <Toaster />
    </>
  )
}
