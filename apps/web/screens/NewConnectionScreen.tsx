import {useAtom} from 'jotai'
import {Plus} from 'phosphor-react'
import React from 'react'
import {match} from 'ts-pattern'

import type {EnvName} from '@usevenice/cdk-core'
import {zEnvName} from '@usevenice/cdk-core'
import {useVenice} from '@usevenice/engine-frontend'
import {
  Container,
  Loading,
  Radio,
  RadioGroup,
  Tab,
  TabContent,
  TabList,
  Tabs,
} from '@usevenice/ui'
import {R} from '@usevenice/util'

import {InstitutionLogo} from '../components/InstitutionLogo'
import {envAtom, modeAtom, searchByAtom} from '../contexts/atoms'

type ConnectMode = 'institution' | 'provider'

export function NewConnectionScreen() {
  const [, setMode] = useAtom(modeAtom)
  const [searchBy, setSearchBy] = useAtom(searchByAtom)
  const [envName, setEnvName] = useAtom(envAtom)
  const [keywords, setKeywords] = React.useState('')
  const {
    ledgerId,
    integrationsRes,
    connect: _connect,
    developerMode,
    ...ls
  } = useVenice({envName, keywords})

  const connect = React.useCallback(
    (...args: Parameters<typeof _connect>) => {
      _connect(...args)
        .finally(() => {
          setMode('manage')
        })
        .then((res) => {
          console.log('connect success', res)
        })
        .catch((err) => {
          console.error('connect error', err)
        })
    },
    [_connect, setMode],
  )

  const onlyIntegrationId =
    integrationsRes.data?.length === 1 && !developerMode
      ? integrationsRes.data[0]?.id
      : undefined

  React.useEffect(() => {
    if (onlyIntegrationId) {
      connect({id: onlyIntegrationId}, {})
    }
  }, [connect, onlyIntegrationId])

  return match(integrationsRes)
    .with({status: 'idle'}, () => null)
    .with({status: 'loading'}, () => (
      <Container className="flex-1">
        <Loading />
      </Container>
    ))
    .with({status: 'error'}, () => (
      <Container className="flex-1">
        <span className="text-xs">Something went wrong</span>
      </Container>
    ))
    .with({status: 'success'}, () => {
      if (onlyIntegrationId) {
        return (
          <Container className="flex-1">
            <Loading />
          </Container>
        )
      }
      return (
        <Tabs
          value={searchBy}
          onValueChange={(newMode) => setSearchBy(newMode as ConnectMode)}>
          <TabList className="border-b border-gray-100">
            <Tab value="institution">By institution</Tab>
            <Tab value="provider">By provider (Developer mode)</Tab>
          </TabList>

          <Container asChild>
            <TabContent
              value="institution"
              className="hidden flex-1 space-y-8 overflow-y-auto radix-state-active:flex">
              <div className="form-control">
                <label htmlFor="keywords" className="label">
                  <span className="label-text">Search institutions</span>
                </label>

                <input
                  type="text"
                  required
                  minLength={1}
                  placeholder="e.g. Chase, Amex"
                  id="keywords"
                  value={keywords}
                  onChange={(event) => setKeywords(event.currentTarget.value)}
                  className="input-bordered input w-full"
                />
              </div>

              {match(ls.insRes)
                .with({status: 'idle'}, () => null)
                .with({status: 'loading'}, () => <Loading />)
                .with({status: 'error'}, () => (
                  <span className="text-xs">Something went wrong</span>
                ))
                .with({status: 'success'}, (res) =>
                  res.data.length === 0 ? (
                    <span className="text-xs">No results</span>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                      {res.data.map(({ins, int}) => (
                        <div
                          key={`${ins.id}`}
                          className="card border border-base-content/25 transition-[transform,shadow] hover:scale-105 hover:shadow-lg">
                          <div className="card-body space-y-4">
                            <div className="flex items-center space-x-4">
                              <InstitutionLogo institution={ins} />

                              <div className="flex flex-col space-y-1">
                                <span className="card-title text-black">
                                  {ins.name}
                                </span>

                                <span className="text-sm">
                                  {R.compact([
                                    ins.id,
                                    int.id,
                                    ins.envName,
                                  ]).join(':')}
                                </span>
                              </div>

                              <div className="flex flex-1 justify-end">
                                <button
                                  className="btn-outline btn btn-sm btn-circle border-base-content/25"
                                  onClick={() =>
                                    connect(int, {institutionId: ins.id})
                                  }>
                                  <Plus />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ),
                )
                .exhaustive()}
            </TabContent>
          </Container>

          <Container asChild>
            <TabContent
              value="provider"
              className="hidden flex-1 space-y-8 overflow-y-auto radix-state-active:flex">
              <RadioGroup
                name="grouped-radios"
                label="Environment"
                orientation="horizontal"
                value={envName}
                onValueChange={(newValue) => setEnvName(newValue as EnvName)}>
                {zEnvName.options.map((o) => (
                  <Radio key={o} id={o} label={o} value={o} />
                ))}
              </RadioGroup>

              <div className="flex flex-col space-y-2">
                {integrationsRes.data?.map((int) => (
                  <button
                    key={int.id}
                    className="h-12 rounded-lg bg-primary px-5 text-white"
                    onClick={() => connect(int, {})}>
                    {int.id}
                  </button>
                ))}
              </div>
            </TabContent>
          </Container>
        </Tabs>
      )
    })
    .exhaustive()
}
