/**
 * Use me like so...
 * tsx ./testOptions.ts plaid | ledgerSync sync
 * tsx ./testOptions.ts plaid | tsx ./prevLedgerSync-cli.ts sync
 */
import fs from 'fs'
import path from 'path'
// eslint-disable-next-line import/no-extraneous-dependencies
import {mapValues} from 'remeda'
import type {DemoSyncInput} from './pages/api/[...trpc]'

const connections: Record<string, DemoSyncInput['src']> = {
  plaid: {
    provider: 'plaid',
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    settings: {accessToken: process.env['PLAID_ACCESS_TOKEN']!},
  },
  import_ramp_csv: {
    provider: 'import',
    settings: {preset: 'ramp', accountExternalId: 'acct_ramp'},
    options: {
      csvString: fs.readFileSync(
        path.join(
          __dirname,
          './__encrypted__/__fixtures__/Ramp_Transaction_Export_2020-06.csv',
        ),
        {encoding: 'utf-8'},
      ),
    },
  },
  // foreceipt_tony: {
  //   provider: 'foreceipt',
  //   settings: {
  //     credentials: {
  //       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  //       email: process.env['FORECEIPT_TONY_EMAIL']!,
  //       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  //       password: process.env['FORECEIPT_TONY_PASSWORD']!,
  //     },
  //   },
  // },

  onebrick: {
    provider: 'onebrick',
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    settings: {accessToken: process.env['ONEBRICK_ACCESS_TOKEN']!},
  },
  gopay_ayu: {
    provider: 'onebrick',
    settings: {accessToken: process.env['GOPAY_AYU_ACCESS_TOKEN']},
  },
  teller: {
    provider: 'teller',
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    settings: {token: process.env['TELLER_TOKEN']!},
  },
  stripe: {
    provider: 'stripe',
    settings: {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      secretKey: process.env['STRIPE_TEST_SECRET_KEY']!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      accountId: process.env['STRIPE_ACCOUNT_ID']!,
    },
  },
  // ramp: {
  //   provider: 'ramp',
  //   settings: {
  //     // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  //     clientId: process.env['RAMP_CLIENT_ID']!,
  //     // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  //     clientSecret: process.env['RAMP_CLIENT_SECRET']!,
  //   },
  // },
  wise: {
    provider: 'wise',
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    settings: {apiToken: process.env['WISE_API_TOKEN']!, envName: 'sandbox'},
  },
  toggl: {
    provider: 'toggl',
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    settings: {apiToken: process.env['TOGGL_API_TOKEN']!},
  },
  yodlee_bayu: {
    provider: 'yodlee',
    settings: {
      // loginName: 'tony@alka.app' // prod,
      loginName: 'sbMem62f0ef80908cf2', // sanbox
      envName: 'sandbox',
      config: {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        clientId: process.env['YODLEE_BAYU_CLIENT_ID']!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        clientSecret: process.env['YODLEE_BAYU_CLIENT_SECRET']!,
      },
      // _id: '10706352' // prod,
      _id: '11309126', // sanbox
    },
  },
}

const options: Record<string, DemoSyncInput> = mapValues(
  connections,
  (src, key): DemoSyncInput => ({
    id: `pipe_${src?.provider}_test`,
    src,
    dest: {
      provider: 'fs',
      settings: {
        basePath: [__dirname, process.env['FS_BASE_PATH'], key].join('/'),
      },
    },
  }),
)
// @ts-ignore
console.log(JSON.stringify(options[process.argv[2]], null, 2))
