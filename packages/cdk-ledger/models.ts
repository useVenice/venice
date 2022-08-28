import {z} from '@ledger-sync/util'

export const zStandard = {
  institution: z.object({
    id: z.string(),
    name: z.string(),
    logoUrl: z.string(),
  }),
}
