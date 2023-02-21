import {LucideLandmark} from 'lucide-react'

import type {ZStandard} from '@usevenice/cdk-core'

export function InstitutionLogo({
  institution,
}: {
  institution?: ZStandard['institution'] | null | undefined
}) {
  return institution?.logoUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={institution.logoUrl}
      alt={`"${institution.name}" logo`}
      className="h-12 w-12 shrink-0 overflow-hidden object-contain"
    />
  ) : (
    <div className="flex h-12 shrink-0 items-center justify-center rounded-lg">
      <LucideLandmark />
    </div>
  )
}
