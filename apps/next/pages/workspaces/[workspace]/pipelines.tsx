import {HStack, VStack} from '@ledger-sync/app-ui'
import {Button, Input} from '@supabase/ui'
import React, {useState} from 'react'
import LayoutSidePanel from '../../components/sidepanel'

export default () => {
  const [visible, setVisible] = useState(false)
  const [_srcConnectionId, setSrcConnectionId] = useState('')
  const [_srcOptions, setSrcOptions] = useState('')
  const [_destConnectionId, setDestConnectionId] = useState('')
  const [_destOptions, setDestOptions] = useState('')
  const toggle = () => setVisible(!visible)
  return (
    <>
      <VStack style={{flex: 1, padding: 20}}>
        <HStack justify="between" style={{paddingBottom: 10}}>
          <h3>My Pipelines</h3>
          <Button onClick={toggle}>Add Pipelines</Button>
        </HStack>
        <table>
          <tr>
            <th>Source Id</th>
            <th>Source Options</th>
            <th>Dest Id</th>
            <th>Dest Options</th>
          </tr>
        </table>
      </VStack>

      <LayoutSidePanel toggle={toggle} visible={visible}>
        <>
          <Input
            onChange={(e) => setSrcConnectionId(e.target.value)}
            label="Source Connection Id"
          />
          <Input
            onChange={(e) => setSrcOptions(e.target.value)}
            label="Source Options JSON"
          />
          <Input
            onChange={(e) => setDestConnectionId(e.target.value)}
            label="Destination Connection ID"
          />
          <Input
            onChange={(e) => setDestOptions(e.target.value)}
            label="Destination Options JSON"
          />
          <Button block>Create / Save</Button>
        </>
      </LayoutSidePanel>
    </>
  )
}
