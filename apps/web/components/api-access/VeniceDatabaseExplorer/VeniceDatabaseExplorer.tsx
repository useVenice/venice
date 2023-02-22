import {useState} from 'react'
import {Editor} from '../../Editor'
import {QueryOutput, useDatabaseQuery} from './QueryOutput'
import {SavedQueryId, useSavedQuery} from './useSavedQuery'

interface VeniceDatabaseExplorerProps {
  apiKey: string
}

export function VeniceDatabaseExplorer(props: VeniceDatabaseExplorerProps) {
  const {apiKey} = props

  const savedQuery = useSavedQuery()
  const [query, setQuery] = useState(
    () => savedQuery.getById(SavedQueryId.transaction)?.query,
  )

  const databaseQuery = useDatabaseQuery({apiKey, query})

  function handleNavItemClick(id: SavedQueryId): void {
    setQuery(savedQuery.getById(id)?.query)
  }

  return (
    <div className="grid gap-6">
      <div className="grid h-[15rem] grid-cols-[minmax(min-content,12rem)_1fr] overflow-hidden rounded-lg border border-venice-black-300 bg-venice-black-500">
        {/* SavedQueryNav | SavedQuerySelect */}
        <nav className="grid gap-2 overflow-y-auto border-r border-venice-black-300 bg-venice-black py-3">
          <NavGroup
            title="Views"
            items={[
              SavedQueryId.account,
              SavedQueryId.transaction,
              SavedQueryId.transaction_split,
            ]}
            onItemClick={handleNavItemClick}
          />
          <NavGroup
            title="Raw data"
            items={[
              SavedQueryId.raw_account,
              SavedQueryId.raw_commodity,
              SavedQueryId.raw_transaction,
            ]}
            onItemClick={handleNavItemClick}
          />
          <NavGroup
            title="Meta data"
            items={[
              SavedQueryId.institution,
              SavedQueryId.pipeline,
              SavedQueryId.resource,
            ]}
            onItemClick={handleNavItemClick}
          />
        </nav>
        <div className="p-3">
          <Editor
            language="sql"
            value={query}
            onChange={setQuery}
            setKeybindings={(monaco) => [
              {
                key: monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
                run: databaseQuery.execute,
              },
            ]}
          />
        </div>
      </div>
      <QueryOutput databaseQuery={databaseQuery} />
    </div>
  )
}

interface NavGroupProps {
  title: string
  items: SavedQueryId[]
  onItemClick: (itemId: SavedQueryId) => void
}

function NavGroup(props: NavGroupProps) {
  const {title, items, onItemClick} = props
  return (
    <div className="px-3 font-mono">
      <h5 className="text-sm text-venice-gray-muted">
        {title} ({items.length})
      </h5>
      <ul className="mt-1 grid gap-1 px-3 text-xs text-offwhite">
        {items.map((v) => (
          <li key={v}>
            <button onClick={() => onItemClick(v)}>{v}</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
