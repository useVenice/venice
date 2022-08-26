import {HStack, VStack} from '@ledger-sync/app-ui'
import {Button, Input} from '@supabase/ui'
import React, {useState} from 'react'
import LayoutSidePanel from '../../components/sidepanel'

export default () => {
  const [visible, setVisible] = useState(false)
  const [_name, setName] = useState('')
  const [_email, setEmail] = useState('')
  const toggle = () => setVisible(!visible)
  return (
    <>
      <VStack style={{flex: 1, padding: 20}}>
        <HStack justify="between" style={{paddingBottom: 10}}>
          <h3>Members</h3>
          <Button onClick={toggle}>Add New Member</Button>
        </HStack>
        <table>
          <tr>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </table>
      </VStack>
      <LayoutSidePanel toggle={toggle} visible={visible}>
        <>
          <Input onChange={(e) => setName(e.target.value)} label="Name" />
          <Input onChange={(e) => setEmail(e.target.value)} label="Email" />
          <Button block>Invite</Button>
        </>
      </LayoutSidePanel>
    </>
  )
}
