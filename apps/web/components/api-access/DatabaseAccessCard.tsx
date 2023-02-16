import {InstructionCard} from '@usevenice/ui'
import {DatabaseIcon} from '@usevenice/ui/icons'
import {CopyTextButton} from '../CopyTextButton'

interface DatabaseAccessCardProps {
  databaseUrl: string
}

export function DatabaseAccessCard(props: DatabaseAccessCardProps) {
  const {databaseUrl} = props
  return (
    <InstructionCard icon={DatabaseIcon} title="Database Access">
      <p className="text-venice-green">
        Directly connect to Venice&apos;s unified database to:
      </p>
      <ul className="list-disc pl-4">
        <li>Build apps & internal tools</li>
        <li>Create dashboards &amp; charts</li>
        <li>Use your favorite SQL editor</li>
        <li>Write custom data analysis scripts</li>
      </ul>
      <div className="flex gap-2 py-2">
        <input
          className="h-8 grow truncate rounded-lg  bg-venice-black-400 px-2 font-mono text-xs text-venice-gray/75 ring-1 ring-inset ring-venice-black-300 focus:outline-none"
          value={databaseUrl}
          readOnly
        />
        <CopyTextButton content={databaseUrl} />
      </div>
    </InstructionCard>
  )
}
