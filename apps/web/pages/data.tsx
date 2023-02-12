import type {GridCell, GridColumn, Item} from '@glideapps/glide-data-grid'
import {GridCellKind} from '@glideapps/glide-data-grid'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import React, {useState} from 'react'

import {Container} from '@usevenice/ui'
import {produce, R} from '@usevenice/util'

import '@glideapps/glide-data-grid/dist/index.css'

import {PageLayout} from '../components/PageLayout'
import {copyToClipboard} from '../contexts/common-contexts'

import type {InferGetServerSidePropsType} from 'next'
import {GetServerSideProps} from 'next'
import {VeniceDataGridTheme} from '../themes'
import {useQuery} from '@tanstack/react-query'
import {LoadingIndicator} from '../components/loading-indicators'
const DataEditor = dynamic(
  () => import('@glideapps/glide-data-grid').then((r) => r.DataEditor),
  {ssr: false},
)

export default function DataExplorerScreen({
  info: {apiKey, databaseUrl, tables},
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const groupedTables = R.groupBy(tables, (t) =>
    t.table_type === 'VIEW'
      ? 'Views'
      : t.table_name.startsWith('raw')
      ? 'Raw tables'
      : 'Meta tables',
  )

  function urlForQuery({
    query,
    format,
    download,
  }: {
    query: string
    format: 'json' | 'csv'
    download?: boolean
  }) {
    return `${
      window.location.origin
    }/api/sql?format=${format}&apiKey=${apiKey}&q=${query}${
      download ? '&dl=1' : ''
    }`
  }

  const [sql, setSql] = useState('SELECT id FROM transaction limit 100')

  const queryRes = useQuery(
    ['sql', sql] as const,
    async ({queryKey}): Promise<Array<Record<string, unknown>>> =>
      fetch(urlForQuery({query: queryKey[1], format: 'json'})).then((r) =>
        r.json(),
      ),
    {enabled: false}, // manual fetching only
  )

  return (
    <PageLayout title="Data Explorer">
      <Container className="flex-1">
        <div>
          <TextFieldToCopy
            className="mt-0"
            title="Database URI"
            value={databaseUrl}
            description="Build custom queries and connect to your favorite
                         dashboard tools to visualize your financial data"
          />

          <TextFieldToCopy
            title="CSV Export"
            value={urlForQuery({query: sql, format: 'csv'})}
            description="Tip: Use with Google Sheet's IMPORTDATA function to pipe
                         data from Venice live into your spreadsheets">
            <button
              className="relative inline-flex cursor-pointer items-center space-x-2 rounded border border-[#FFF]/10  bg-black px-2.5 py-2 text-center text-xs outline-none outline-0 transition hover:bg-[#222] active:bg-black"
              type="button"
              onClick={() =>
                window.open(
                  urlForQuery({query: sql, format: 'csv', download: true}),
                )
              }>
              <Image
                src="/copy-icon.svg"
                alt="Copy text"
                width={14}
                height={14}
              />
              <span className="truncate">Download</span>
            </button>
          </TextFieldToCopy>
        </div>

        {/* Data Explorer */}
        <div className="mt-12 flex flex-col gap-2">
          {/* Header */}
          <div className="flex flex-row gap-2">
            <span className="mr-auto text-lg font-bold">Data Explorer</span>
            {queryRes.isFetching && <LoadingIndicator />}
            <button
              className="rounded-lg border border-[#000]/50 bg-green px-4 py-2 text-xs hover:bg-green/90 active:bg-green/75"
              onClick={() => queryRes.refetch()}>
              Execute SQL
            </button>
          </div>

          {/* SQL Editor Area */}
          <div className="flex flex-row">
            <div>
              {Object.entries(groupedTables).map(([group, tables]) => (
                <React.Fragment key={group}>
                  <h3 className="text-sm font-light text-offwhite/50">{`${group} (${tables.length})`}</h3>
                  <ul>
                    {tables.map(({table_name: name}) => (
                      <li
                        className="mt-1 cursor-pointer pl-4 font-mono text-sm text-offwhite/75"
                        key={name}
                        onClick={() => {
                          setSql(`SELECT * FROM "${name}" LIMIT 10`)
                          // TODO: Figure otu the right pattern to run refetch after state has been updated only...
                          setTimeout(() => {
                            queryRes.refetch()
                          }, 0)
                        }}>
                        {name}
                      </li>
                    ))}
                  </ul>
                </React.Fragment>
              ))}
            </div>
            <textarea
              className="ml-12 flex-1 resize-none rounded-lg border border-base-content/50 bg-primaryUIControl p-3 font-mono text-offwhite"
              value={sql}
              onChange={(e) => setSql(e.target.value)}></textarea>
          </div>

          {/* SQL Results */}
          <div className="mt-2 max-h-[80vh] overflow-scroll">
            <ResultTableView rows={queryRes.data ?? []} />
          </div>
        </div>
      </Container>
    </PageLayout>
  )
}

/* Text Field w/ Copy Button */

interface TextFieldToCopyProps extends React.ComponentPropsWithoutRef<'div'> {
  title: string
  value: string
  description: string
}

function TextFieldToCopy({
  className = 'mt-8',
  title,
  value,
  description,
  children,
}: TextFieldToCopyProps) {
  return (
    <div className={className}>
      <h2 className="text-lg font-bold">{title}</h2>
      <div className="relative mt-2 flex flex-row justify-between">
        <input
          className="mr-3 w-full flex-1 rounded-lg border border-base-content/50 bg-primaryUIControl p-2 font-mono text-sm text-offwhite/50"
          value={value}
          disabled></input>
        <div className="absolute inset-y-0 right-0 mr-3 flex items-center space-x-1 pl-3 pr-1">
          {children}
          <button
            className="relative inline-flex cursor-pointer items-center space-x-2 rounded border border-[#FFF]/10  bg-black px-2.5 py-2 text-center text-xs outline-none outline-0 transition hover:bg-[#222] active:bg-black"
            type="button"
            onClick={() => {
              copyToClipboard(value)
            }}>
            <Image
              src="/copy-icon.svg"
              alt="Copy text"
              width={14}
              height={14}
            />
            <span className="truncate">Copy</span>
          </button>
        </div>
      </div>
      <p className="mt-2 text-sm">{description}</p>
    </div>
  )
}

/* Data Grid */

export function ResultTableView({
  rows,
}: {
  rows: Array<Record<string, unknown>>
}) {
  // Grid columns may also provide icon, overlayIcon, menu, style, and theme overrides

  const [columns, setColumns] = React.useState<GridColumn[]>([])
  React.useLayoutEffect(() => {
    setColumns(
      Object.keys(rows[0] ?? {}).map(
        (key): GridColumn => ({id: key, title: key}),
      ),
    )
  }, [rows])

  // If fetching data is slow you can use the DataEditor ref to send updates for cells
  // once data is loaded.

  function getData([colIdx, rowIdx]: Item): GridCell {
    const col = columns[colIdx]!
    // if (!col) {
    //   debugger
    //   console.error('missing column', colIdx)
    // }
    const row = rows[rowIdx]!
    const cell = row[col.id!]
    const data = !cell
      ? ''
      : typeof cell === 'string'
      ? cell
      : JSON.stringify(cell)

    // Unfortunately copying of JSON value is really not going to work well
    // as they are escaped poorly for our purposes...
    // @see https://github.com/glideapps/glide-data-grid/blob/main/packages/core/src/data-editor/data-editor-fns.ts#L232-L263
    return {
      kind: GridCellKind.Text,
      allowOverlay: false,
      data,
      displayData: data,
    }
  }

  return !columns.length ? null : (
    <DataEditor
      getCellContent={getData}
      getCellsForSelection={true} // Enables copy
      copyHeaders
      columns={columns}
      rows={rows.length}
      smoothScrollX
      smoothScrollY
      onColumnResize={(col, newSize) => {
        console.log('col resize', col, newSize)
        setColumns((existing) =>
          produce(existing, (draft) => {
            const c = draft.find((c) => c.id === col.id)
            if (c) {
              // @ts-expect-error
              c.width = newSize
            }
          }),
        )
      }}
      theme={VeniceDataGridTheme}
    />
  )
}

export const getServerSideProps = (async (context) => {
  const {serverGetUser, getDatabaseInfo} = await import('../server')
  const user = await serverGetUser(context)
  if (!user?.id) {
    return {redirect: {destination: '/', permanent: false}}
  }
  const info = await getDatabaseInfo(user.id)
  return {props: {info}}
}) satisfies GetServerSideProps
