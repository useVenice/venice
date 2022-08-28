import {
  base64url,
  createHTTPClient,
  memoize,
  z,
  zFunction,
} from '@ledger-sync/util'
import institutionsWsResponse from './institutionWsResponse.json'

// Will be used on production mode to use cert
/*
import fs from 'fs'
import https from 'https'
import path from 'path'
*/
export const zEnvName = z.enum(['sandbox', 'development', 'production'])

declare global {
  interface Window {
    TellerConnect: string
  }
}

// Todo: Move all of schema to separate file or keep it stay
const linksSchema = z.object({
  balances: z.string().nullish(),
  details: z.string().nullish(),
  self: z.string().nullish(),
  transactions: z.string().nullish(),
  account: z.string().nullish(),
})

export const balancesTellerSchema = z.object({
  account_id: z.string(),
  available: z.string(),
  ledger: z.string(),
  links: linksSchema,
})

export const transactionItemSchema = z.object({
  account_id: z.string(),
  amount: z.string(),
  date: z.string(),
  description: z.string(),
  details: z.object({
    category: z.string(),
    processing_status: z.string(),
    counterparty: z.object({
      name: z.string(),
      type: z.string(),
    }),
  }),
  id: z.string(),
  links: linksSchema,
})

export const accountTellerSchema = z.object({
  type: z.string(),
  name: z.string(),
  subtype: z.string(),
  status: z.string(),
  last_four: z.string(),
  id: z.string(),
  enrollment_id: z.string(),
  currency: z.string(),
  institution: z.object({
    id: z.string(),
    name: z.string(),
  }),
  links: linksSchema,
  balance: balancesTellerSchema.nullish(),
})

export const institutionSchema = z.object({
  id: z.string(),
  name: z.string(),
  logoUrl: z.string(),
})

const accountDetailTellerSchema = z.object({
  routing_numbers: z.object({ach: z.string()}),
  links: linksSchema,
  account_number: z.string().nullish(),
  account_id: z.string(),
})

const inputAccountSchema = z.object({
  id: z.string(),
  envName: zEnvName.nullish(),
})

export const zTellerConfig = z.object({
  token: z.string().nullish(),
  applicationId: z.string().nullish(),
})

type EnvName = z.infer<typeof zEnvName>
// Reference: https://teller.io/docs/api/2020-10-12
export const makeTellerClient = zFunction(zTellerConfig, (cfg) => {
  const fromEnv = memoize((envName: EnvName | undefined) => {
    if (!envName) {
      throw new Error(`Unable to get client envName=${envName}`)
    }

    const username = cfg.token
    const token = `${username}:`
    const encodedToken = Buffer.from(token, 'utf8').toString('base64')
    return createHTTPClient({
      baseURL: 'https://api.teller.io',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Basic ${encodedToken}`,
      },
      // Will be used on production mode
      // httpsAgent: new https.Agent({
      //   cert: fs.readFileSync(path.join(__dirname,"../../../../../../../docs/teller/certificate.pem")),
      //   key:  fs.readFileSync(path.join(__dirname,"../../../../../../../docs/teller/private_key.pem")),
      // }),
    })
  })

  return {
    /**
     * Example: CLIENT=<client-name> tsx <dir-cli> getAccounts --token test_token_n7gtbqtl6dzgu --id acc_o41dps5jq0c15frcik000
     */
    getAccounts: zFunction(zEnvName.nullish(), (envName) =>
      fromEnv(envName ?? 'sandbox')
        .get('/accounts')
        .then((r) => r.data.map((d: unknown) => accountTellerSchema.parse(d))),
    ),

    /**
     * Example: CLIENT=<client-name> tsx <dir-cli> getAccount --token test_token_n7gtbqtl6dzgu --id acc_o41dps5jq0c15frcik000
     */
    getAccount: zFunction(inputAccountSchema, (params) =>
      fromEnv(params.envName ?? 'sandbox')
        .get(`/accounts/${params.id}`)
        .then((r) => {
          accountTellerSchema.parse(r.data)
        }),
    ),

    /**
     * Example: CLIENT=<client-name> tsx <dir-cli> getAccountDetails --token test_token_n7gtbqtl6dzgu --id acc_o41dps5jq0c15frcik000
     */
    getAccountDetails: zFunction(inputAccountSchema, (params) =>
      fromEnv(params.envName ?? 'sandbox')
        .get(`/accounts/${params.id}/details`)
        .then((r) => accountDetailTellerSchema.parse(r.data)),
    ),

    /**
     * Example: CLIENT=<client-name> tsx <dir-cli> getAccountBalances --token test_token_n7gtbqtl6dzgu --id acc_o41dps5jq0c15frcik000
     */
    getAccountBalances: zFunction(inputAccountSchema, (params) =>
      fromEnv(params.envName ?? 'sandbox')
        .get(`/accounts/${params.id}/balances`)
        .then((r) => balancesTellerSchema.parse(r.data)),
    ),

    /**
     * Example: CLIENT=<client-name> tsx <dir-cli> getTransactions --token test_token_n7gtbqtl6dzgu --id acc_o41dps5jq0c15frcik000
     */
    getTransactions: zFunction(inputAccountSchema, (params) =>
      fromEnv(params.envName ?? 'sandbox')
        .get(`/accounts/${params.id}/transactions`)
        .then((r) =>
          r.data.map((d: unknown) => transactionItemSchema.parse(d)),
        ),
    ),

    /** Teller does not seem to have an institution endpoint. So we will do this for now */
    getInstitutions: zFunction([], z.array(institutionSchema), () => {
      const list = institutionsWsResponse.response.diff[6][0][0]['d'] as Array<
        [string, string, string, string]
      >
      return list.map(([, id, svg, name]) => ({
        id,
        name,
        // Courtesy of https://css-tricks.com/probably-dont-base64-svg/
        logoUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(svg),
      }))
    }),
  }
})
