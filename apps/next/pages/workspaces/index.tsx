import {HStack, Text, VStack} from '@ledger-sync/app-ui'
import {Button, IconCircle, IconCompass, Input, SidePanel} from '@supabase/ui'
import {useRouter} from 'next/router'
import React, {useState} from 'react'

export default function () {
  const [workspaces, _] = useState(['Hobby Project', 'Alka'])
  const [visible, setVisible] = useState(false)
  const [_workspaceName, setWorkspaceName] = useState('')
  const toggle = () => setVisible(!visible)
  const router = useRouter()

  return (
    <VStack
      gap="md"
      css={{
        width: '100%',
        height: '100%',
        maxWidth: '$bpsm',
        maxHeight: '100vh',
        marginX: 'auto',
      }}
      >
      <HStack>
        <Text>
          Workspaces let you collaborate with team members, add permissions and
          share sources across your whole team under a shared billing account.
        </Text>
        <IconCompass size={48} />
      </HStack>

      {workspaces.map((workspace) => (
        <Button
          style={{backgroundColor: 'grey'}}
          block
          onClick={() =>
            router.push(
              `/workspaces/${workspace
                .toLowerCase()
                .replace(' ', '-')}/integrations`,
            )
          }>
          {workspace}
        </Button>
      ))}
      <Button onClick={toggle} block>
        New Workspaces
      </Button>
      <SidePanel
        visible={visible}
        onCancel={toggle}
        onConfirm={() => {
          toggle()
          // TODO: Add function to create new workspace
        }}
        hideFooter>
        <VStack gap="sm">
          <Input
            label="Name *"
            onChange={(e) => setWorkspaceName(e.target.value)}
          />
          <Button block>Create</Button>
        </VStack>
      </SidePanel>
    </VStack>
  )
}
