export interface GetIFrameProps {
  deploymentUrl?: string
  params?: {token?: string; displayName?: string}
}

export const getIFrameUrl = ({
  deploymentUrl = 'https://app-staging.venice.is/',
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
