import {createEnv} from '@t3-oss/env-nextjs'
import {z} from 'zod'

export const envConfig = {
  server: {
    POSTGRES_OR_WEBHOOK_URL: z.string().describe(`
Pass a valid postgres(ql):// url for stateful mode. Will be used Primary database used for metadata and user data storage
Pass a valid http(s):// url for stateless mode. Sync data and metadata be sent to provided URL and you are responsible for your own persistence`),
    JWT_SECRET_OR_PUBLIC_KEY: z
      .string()
      .trim()
      .describe('Used for validating authenticity of accessToken'),

    CLERK_SECRET_KEY: z.string(),
    SENTRY_CRON_MONITOR_ID: z
      .string()
      .optional()
      .describe('Used to monitor the schedule syncs cron job'),

    INNGEST_EVENT_KEY: z.string(),
    INNGEST_SIGNING_KEY: z.string(),
    NANGO_SECRET_KEY: z.string(),
  },
  client: {
    NEXT_PUBLIC_SUPABASE_URL: z.string(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
    NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
    NEXT_PUBLIC_SENTRY_ORG: z.string().optional(),
    NEXT_PUBLIC_POSTHOG_WRITEKEY: z.string().optional(),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
    NEXT_PUBLIC_CLERK_SUPABASE_JWT_TEMPLATE_NAME: z
      .string()
      .default('supabase'),
    NEXT_PUBLIC_NANGO_PUBLIC_KEY: z.string(),
    NEXT_PUBLIC_COMMANDBAR_ORG_ID: z.string().optional(),
  },
  runtimeEnv: overrideFromLocalStorage({
    CLERK_SECRET_KEY: process.env['CLERK_SECRET_KEY'],
    INNGEST_EVENT_KEY: process.env['INNGEST_EVENT_KEY'],
    INNGEST_SIGNING_KEY: process.env['INNGEST_SIGNING_KEY'],
    NANGO_SECRET_KEY: process.env['NANGO_SECRET_KEY'],
    NEXT_PUBLIC_NANGO_PUBLIC_KEY: process.env['NEXT_PUBLIC_NANGO_PUBLIC_KEY'],
    JWT_SECRET_OR_PUBLIC_KEY: process.env['JWT_SECRET_OR_PUBLIC_KEY'],
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env['NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY'],
    NEXT_PUBLIC_CLERK_SUPABASE_JWT_TEMPLATE_NAME:
      process.env['NEXT_PUBLIC_CLERK_SUPABASE_JWT_TEMPLATE_NAME'],
    NEXT_PUBLIC_COMMANDBAR_ORG_ID: process.env['NEXT_PUBLIC_COMMANDBAR_ORG_ID'],
    NEXT_PUBLIC_POSTHOG_WRITEKEY: process.env['NEXT_PUBLIC_POSTHOG_WRITEKEY'],
    NEXT_PUBLIC_SENTRY_DSN: process.env['NEXT_PUBLIC_SENTRY_DSN'],
    NEXT_PUBLIC_SENTRY_ORG: process.env['NEXT_PUBLIC_SENTRY_ORG'],
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'],
    NEXT_PUBLIC_SUPABASE_URL: process.env['NEXT_PUBLIC_SUPABASE_URL'],
    POSTGRES_OR_WEBHOOK_URL: process.env['POSTGRES_OR_WEBHOOK_URL'],
    SENTRY_CRON_MONITOR_ID: process.env['SENTRY_CRON_MONITOR_ID'],
  }),
  onInvalidAccess: (variable: string) => {
    throw new Error(
      `❌ Attempted to access server-side environment variable ${variable} on the client`,
    )
  },
  skipValidation: !!process.env['SKIP_ENV_VALIDATION'],
} satisfies Parameters<typeof createEnv>[0]

export const env = createEnv(envConfig)
export type Env = typeof env

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
;(globalThis as any).env = env

/** Allow NEXT_PUBLIC values to be overwriten from localStorage for debugging purposes */
function overrideFromLocalStorage<T>(runtimeEnv: T) {
  if (typeof window !== 'undefined' && window.localStorage) {
    for (const key in runtimeEnv) {
      if (key.startsWith('NEXT_PUBLIC_')) {
        const value = window.localStorage.getItem(key)
        if (value != null) {
          runtimeEnv[key] = value as T[Extract<keyof T, string>]
          console.warn(`[env] Overriding from localStorage ${key} = ${value}`)
        }
      }
    }
  }
  return runtimeEnv
}
