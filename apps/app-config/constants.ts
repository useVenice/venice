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

export const getGraphqlEndpoint = (
  req: GetServerSidePropsContext['req'] | null,
) => new URL('/api/graphql', getServerUrl(req))

export const getRestEndpoint = (req: GetServerSidePropsContext['req'] | null) =>
  new URL('/api/rest', getServerUrl(req))

export const xPatHeaderKey = 'x-token'
export const xPatUrlParamKey = '_token'
export const xPatAppMetadataKey = 'apiKey'

export const kAcceptUrlParam = '_accept'
