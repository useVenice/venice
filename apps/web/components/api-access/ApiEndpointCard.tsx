import {InstructionCard} from '@usevenice/ui'
import {CsvFileIcon, JsonFileIcon} from '@usevenice/ui/icons'
import {CopyTextButton} from '../CopyTextButton'

interface ApiEndpointCard {
  format: 'csv' | 'json'
  queryUrl: string
}

export function ApiEndpointCard(props: ApiEndpointCard) {
  const {format, queryUrl} = props
  const icon = format === 'csv' ? CsvFileIcon : JsonFileIcon
  return (
    <InstructionCard icon={icon} title="API Endpoint">
      <p className="text-venice-green">
        Easily call into Venice as a {format.toUpperCase()} API for this query:
      </p>
      <textarea
        className="resize-none rounded-lg bg-venice-black-400 p-2 font-mono text-xs text-venice-gray/75 ring-1 ring-inset ring-venice-black-300 focus:outline-none"
        rows={6}
        value={queryUrl}
        readOnly
      />
      <div>
        <CopyTextButton content={queryUrl} />
      </div>
    </InstructionCard>
  )
}
