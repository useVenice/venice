import {ResourceCard} from './ResourceCard'

export function DestinationComingSoonCard() {
  return (
    <ResourceCard tagColor="venice-gold">
      <div className="grid gap-4 px-6 py-4 text-sm">
        <p>
          👉 Soon: send your unified Venice data to Notion, Excel, Coda, and
          more!
        </p>
        <p>
          Have a destination in mind?{' '}
          <a
            className="text-green hover:text-opacity-70"
            href="mailto:hi@venice.is">
            Reach&nbsp;out!
          </a>
        </p>
      </div>
    </ResourceCard>
  )
}
