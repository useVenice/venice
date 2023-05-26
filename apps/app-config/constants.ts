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

export const kApikeyUrlParam = 'apikey'
export const kApikeyMetadata = 'apikey'
export const kApikeyHeader = 'x-apikey'

export const kAcceptUrlParam = '_accept'

export const kAccessToken = '_token' as const

export const __DEBUG__ =
  getServerUrl(null).includes('localhost') ||
  Boolean(
    typeof window !== 'undefined' && window.localStorage.getItem('__DEBUG__'),
  )
