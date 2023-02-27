/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import type {GetServerSidePropsContext} from 'next'

export function getServerUrl(req: GetServerSidePropsContext['req'] | null) {
  return (
    (typeof window !== 'undefined' &&
      `${window.location.protocol}//${window.location.host}`) ||
    (req &&
      `${req.headers['x-forwarded-proto'] || 'http'}://${req.headers.host}`) ||
    (process.env['VERCEL_URL']
      ? 'https://' + process.env['VERCEL_URL']
      : null) ||
    `http://localhost:${
      process.env['PORT'] || process.env['NEXT_PUBLIC_PORT'] || 3000
    }`
  )
}

export const graphqlEndpoint = new URL('/api/graphql', getServerUrl(null))

export const restEndpoint = new URL('/api/rest', getServerUrl(null))

export const xPatHeaderKey = 'x-token'
export const xPatUrlParamKey = 'token'
export const xPatUserMetadataKey = 'personal_access_token'
