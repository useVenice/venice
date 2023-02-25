import {Button, InstructionCard} from '@usevenice/ui'
import {EmailIcon, DatabaseIcon} from '@usevenice/ui/icons'
import Link from 'next/link'

export function SQLAccessCard() {
  return (
    <InstructionCard icon={DatabaseIcon} title="Dedicated database package">
      <p className="text-venice-green">
        Please reach out if you&apos;re interested in::
      </p>
      <ul className="list-disc pl-4">
        <li>Dedicated Postgres database (or bring your own)</li>
        <li>Control scaleability, backups, compute, and more</li>
        <li>Raw SQL access (for backends, data analysis, etc.)</li>
      </ul>
      <div className="flex gap-2 py-2 pr-7">
        <Button variant="primary" asChild className="gap-2">
          <Link href="mailto:hi@venice.is">
            <EmailIcon className="h-4 w-4 fill-current text-offwhite" />
            Contact Us
          </Link>
        </Button>
      </div>
    </InstructionCard>
  )
}
