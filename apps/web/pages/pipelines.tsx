import {useAtom, useAtomValue} from 'jotai'
import React from 'react'
import {useFilter, useSelect} from 'react-supabase'
import {twMerge} from 'tailwind-merge'

import type {Id} from '@usevenice/cdk-core'
import {VeniceProvider} from '@usevenice/engine-frontend'
import {Container, Tab, TabContent, TabList, Tabs} from '@usevenice/ui'

import {PageContainer} from '../components/common-components'
import {ledgerIdAtom, modeAtom, pipelineTypeAtom} from '../contexts/atoms'
import {MyConnectionsScreen} from '../screens/MyConnectionsScreen'
import {NewConnectionScreen} from '../screens/NewConnectionScreen'

export default function ConnectionsScreen() {
  const [pipelineType, setPipelineType] = useAtom(pipelineTypeAtom)
  const {userId} = VeniceProvider.useContext()

  const [ledgerId, setLedgerId] = useAtom(ledgerIdAtom)
  const [ledgersRes] = useSelect('connection', {
    filter: useFilter((query) => query.eq('provider_name', 'postgres'), []),
  })

  React.useEffect(() => {
    if (
      ledgersRes.data?.length &&
      !ledgersRes.fetching &&
      !ledgersRes.data?.find((l) => l.id === ledgerId)
    ) {
      setLedgerId(ledgersRes.data?.[0]?.id)
    }
  }, [ledgerId, ledgersRes.data, ledgersRes.fetching, setLedgerId])

  const connectWith = React.useMemo(
    () => ({destinationId: ledgerId as Id['conn']}),
    [ledgerId],
  )

  return (
    <PageContainer
      authenticated
      flex
      links={[
        {
          label: 'New connection',
          href: '/v2/connections?mode=connect',
          primary: true,
          fixed: true,
        },
      ]}>
      {/* TabList, visible on mobile only */}
      <div className="flex flex-row md:hidden">
        <h2
          className="flex-1 cursor-pointer p-3 text-lg font-bold"
          onClick={() => setPipelineType('sources')}>
          Pipelines in
        </h2>
        <h2
          className="flex-1 cursor-pointer p-3 text-lg font-bold"
          onClick={() => setPipelineType('destinations')}>
          Pipelines out
        </h2>
      </div>

      {/* Tab contents */}
      <div className="flex flex-1 flex-row items-stretch">
        <div
          className={twMerge(
            'flex-1',
            pipelineType !== 'sources' && 'hidden md:block',
          )}>
          <h2 className="hidden flex-1 p-3 text-lg font-bold md:block">
            Pipelines in
          </h2>
          Sources...
        </div>
        <div className="hidden self-center md:block">Venice logo</div>
        <div
          className={twMerge(
            'flex-1',
            pipelineType !== 'destinations' && 'hidden md:block',
          )}>
          <h2 className="hidden flex-1 p-3 text-lg font-bold md:block">
            Pipelines out
          </h2>
          Destinations...
        </div>
      </div>
      {/* <Tabs defaultValue="sources">
        <TabList className="border-b border-gray-100">
          <Tab value="sources">Pipelines in</Tab>
          <Tab value="destinations">Pipelines out</Tab>
        </TabList>
        <TabContent value="sources">Sources...</TabContent>
        <TabContent value="destinations">Destinations</TabContent>
      </Tabs> */}
    </PageContainer>
  )
}
