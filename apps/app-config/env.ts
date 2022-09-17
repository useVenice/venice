import {z, zEnvVars} from '@ledger-sync/util'

export const zCommonEnv = zEnvVars({
  NEXT_PUBLIC_API_URL: z
    .string()
    .default('/api')
    .describe(
      `Fully qualified url your venice api used for webhooks and server-side rendering.
      Normally this is $SERVER_HOSTNAME/api. e.g. https://connect.example.com/api`,
    ),
})

export const zBackendEnv = zEnvVars({
  ...zCommonEnv.shape,
  POSTGRES_URL: z
    .string()
    .describe('Primary database used for metadata and user data storage'),
  JWT_SECRET_OR_PUBLIC_KEY: z
    .string()
    .optional()
    .describe('Used for validating authenticity of accessToken'),

  // TODO: Generate me based on integrations which are enabled...
  PLAID_CLIENT_ID: z.string().optional(),
  PLAID_SANDBOX_SECRET: z.string().optional(),
  PLAID_DEVELOPMENT_SECRET: z.string().optional(),
  PLAID_PRODUCTION_SECRET: z.string().optional(),

  YODLEE_SANDBOX_CLIENT_ID: z.string().optional(),
  YODLEE_SANDBOX_CLIENT_SECRET: z.string().optional(),
  YODLEE_SANDBOX_ADMIN_LOGIN_NAME: z.string().optional(),
  YODLEE_DEVELOPMENT_CLIENT_ID: z.string().optional(),
  YODLEE_DEVELOPMENT_CLIENT_SECRET: z.string().optional(),
  YODLEE_DEVELOPMENT_ADMIN_LOGIN_NAME: z.string().optional(),
  YODLEE_PRODUCTION_CLIENT_ID: z.string().optional(),
  YODLEE_PRODUCTION_CLIENT_SECRET: z.string().optional(),
  YODLEE_PRODUCTION_ADMIN_LOGIN_NAME: z.string().optional(),
  YODLEE_PRODUCTION_PROXY_URL: z.string().optional(),
  YODLEE_PRODUCTION_PROXY_CERT: z.string().optional(),

  TELLER_APPLICATION_ID: z.string().optional(),
})
