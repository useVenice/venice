import {HStack, VStack} from '@ledger-sync/app-ui'
import {Button, Input} from '@supabase/ui'
import React, {useState} from 'react'
import LayoutSidePanel from '../../components/sidepanel'

export default () => {
  const [visible, setVisible] = useState(false)
  const [_providerName, setProviderName] = useState('')
  const [_integrationId, setIntegrationId] = useState('')
  const [_settings, setSetting] = useState('')
  const toggle = () => setVisible(!visible)
  return (
    <>
      <VStack style={{flex: 1, padding: 20}}>
        <HStack justify="between" style={{paddingBottom: 10}}>
          <h3>My Connections</h3>
          <Button onClick={toggle}>Add Connection</Button>
        </HStack>
        <table>
          <tr>
            <th>Name</th>
            <th>Integration Id</th>
            <th>Settings</th>
          </tr>
        </table>
      </VStack>
      <LayoutSidePanel toggle={toggle} visible={visible}>
        <>
          <Input
            onChange={(e) => setProviderName(e.target.value)}
            label="Provider Name *"
          />
          <Input
            onChange={(e) => setIntegrationId(e.target.value)}
            label="Integration Id *"
          />
          <Input
            onChange={(e) => setSetting(e.target.value)}
            label="Setting JSON "
          />
          <Button block>Create / Save</Button>
        </>
      </LayoutSidePanel>
    </>
  )
}
