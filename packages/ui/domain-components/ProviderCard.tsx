import React from 'react'

import type {ProviderMeta} from '@usevenice/cdk-core'

import {Badge, Card} from '../new-components'
import {cn} from '../utils'

// Should this live in useVenice/ui? probably
export const ProviderCard = ({
  provider,
  children,
  showStageBadge = false,
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  Image = (props) => <img {...props} />,
}: {
  provider: ProviderMeta
  children?: React.ReactNode
  showStageBadge?: boolean
  /** Pass in the Next.js Image component */
  Image?: React.FC<
    Omit<
      React.DetailedHTMLProps<
        React.ImgHTMLAttributes<HTMLImageElement>,
        HTMLImageElement
      >,
      'loading' | 'ref'
    >
  >
}) => (
  <Card
    key={provider.name}
    className="m-3 flex h-48 w-48 flex-col items-center p-2">
    <div className="flex self-stretch">
      {showStageBadge && (
        <Badge
          variant="secondary"
          className={cn(
            'ml-auto',
            provider.stage === 'ga' && 'bg-green-200',
            provider.stage === 'beta' && 'bg-blue-200',
            provider.stage === 'alpha' && 'bg-pink-50',
          )}>
          {provider.stage}
        </Badge>
      )}
    </div>
    {provider.logoUrl ? (
      <Image
        width={100}
        height={100}
        src={provider.logoUrl}
        alt={provider.displayName}
        className="grow object-contain"
      />
    ) : (
      <div className="flex grow flex-col items-center justify-center">
        <caption>{provider.displayName}</caption>
      </div>
    )}
    {children}
  </Card>
)
