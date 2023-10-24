import {z} from 'zod'

export const zFrameMessage = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('SUCCESS'),
    data: z.object({resourceId: z.string()}), // Need to better type resourceId
  }),
  z.object({
    type: z.literal('ERROR'),
    data: z.object({code: z.string(), message: z.string()}),
  }),
])
export type FrameMessage = z.infer<typeof zFrameMessage>

export const defaultVeniceHost = 'https://app.venice.is'

export interface GetIFrameProps {
  deploymentUrl?: string
  params?: {token?: string; displayName?: string}
}

export const getIFrameUrl = ({
  deploymentUrl = defaultVeniceHost,
  params = {},
}: GetIFrameProps) => {
  const url = new URL('/connect', deploymentUrl)
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.append(key, value)
    }
  })
  return url.toString()
}
