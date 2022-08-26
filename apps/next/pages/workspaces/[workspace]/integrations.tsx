import {HStack, VStack} from '@ledger-sync/app-ui'
import {Button, Input} from '@supabase/ui'
import React, {useState} from 'react'
import LayoutSidePanel from '../../components/sidepanel'

export default () => {
  const [visible, setVisible] = useState(false)
  const [_providerName, setProviderName] = useState('')
  const [_config, setConfig] = useState('')
  const toggle = () => setVisible(!visible)
  const [integrations, _] = useState([
    {
      providerName: 'One Brick',
      status: 'Connected',
      config: '{}',
    },
    {
      providerName: 'Wise',
      status: 'Connected',
      config: '{}',
    },
    {
      providerName: 'Plaid',
      status: 'Connected',
      config: '{}',
    },
  ])
  return (
    <>
      <VStack style={{flex: 1, padding: 20}}>
        <HStack justify="between" style={{paddingBottom: 10}}>
          <h3>My Integrations</h3>
          <Button onClick={toggle}>Add Integration</Button>
        </HStack>
        <table>
          <tr>
            <th>Provider Name</th>
            <th>Status</th>
            <th>Config</th>
          </tr>
          {integrations.map(({providerName, status, config}) => (
            <tr>
              <td>{providerName}</td>
              <td>{status}</td>
              <td>{config}</td>
            </tr>
          ))}
        </table>
        <VStack gap="sm">
          <h4>Test integrations connect</h4>
          <HStack justify="start" gap="md">
            <Input label="User Id" />
            <Button style={{height: 30, alignSelf: 'end'}}>
              Open Connect UI
            </Button>
          </HStack>
        </VStack>
      </VStack>
      <LayoutSidePanel visible={visible} toggle={toggle}>
        <>
          <Input
            onChange={(e) => setProviderName(e.target.value)}
            label="Provider Name *"
          />
          <Input
            onChange={(e) => setConfig(e.target.value)}
            label="Config JSON *"
          />
          <Button block>Create / Save</Button>
        </>
      </LayoutSidePanel>
    </>
  )
}
