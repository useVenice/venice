/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
import * as Sentry from '@sentry/nextjs'
import {z} from '@usevenice/util'
import {posthog} from 'posthog-js'

const SENTRY_DSN =
  process.env['SENTRY_DSN'] || process.env['NEXT_PUBLIC_SENTRY_DSN']

const NODE_ENV = process.env.NODE_ENV || process.env['NEXT_PUBLIC_NODE_ENV']

;(globalThis as any).NODE_ENV = NODE_ENV

Sentry.init({
  enabled: NODE_ENV === 'production',
  dsn: SENTRY_DSN,
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1.0,
  // ...
  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
  integrations: [
    // @see https://share.cleanshot.com/zz9KPwZh
    // https://share.cleanshot.com/zz9KPwZh
    new posthog.SentryIntegration(
      posthog,
      z.string().parse(process.env['NEXT_PUBLIC_SENTRY_ORG']),
      z.number().parse(Number.parseInt(SENTRY_DSN?.split('/').pop() ?? '')),
    ),
  ],
})
Sentry.setTags({
  'vercel.env':
    process.env['VERCEL_ENV'] || process.env['NEXT_PUBLIC_VERCEL_ENV'],
  'git.branch':
    process.env['VERCEL_GIT_COMMIT_REF'] ||
    process.env['NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF'],
})

console.log('sentry initialized')

export {Sentry}
