import {z} from '@usevenice/util'

export const zListParams = z.object({
  limit: z.number().optional(),
  offset: z.number().optional(),
})
