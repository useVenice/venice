import {Input, InstructionCard} from '@usevenice/ui'
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
        <Input className="grow truncate" value={databaseUrl} readOnly />
        <CopyTextButton content={databaseUrl} />
      </div>
    </InstructionCard>
  )
}
