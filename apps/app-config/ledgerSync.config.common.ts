import {debugProvider} from '@ledger-sync/cdk-core'
import {airtableProvider} from '@ledger-sync/core-integration-airtable'
import {firebaseProvider} from '@ledger-sync/core-integration-firebase'
import {fsProvider} from '@ledger-sync/core-integration-fs'
import {mongodbProvider} from '@ledger-sync/core-integration-mongodb'
import {corePostgresProvider} from '@ledger-sync/core-integration-postgres'
import {LSProvider} from '@ledger-sync/engine-frontend'
import {beancountProvider} from '@ledger-sync/integration-beancount'
import {foreceiptProvider} from '@ledger-sync/integration-foreceipt'
import {importProvider} from '@ledger-sync/integration-import'
import {oneBrickProvider} from '@ledger-sync/integration-onebrick'
import {plaidProvider} from '@ledger-sync/integration-plaid'
import {postgresProvider} from '@ledger-sync/integration-postgres'
import {rampProvider} from '@ledger-sync/integration-ramp'
import {splitwiseProvider} from '@ledger-sync/integration-splitwise'
import {stripeProvider} from '@ledger-sync/integration-stripe'
import {tellerProvider} from '@ledger-sync/integration-teller'
import {togglProvider} from '@ledger-sync/integration-toggl'
import {wiseProvider} from '@ledger-sync/integration-wise'
import {yodleeProvider} from '@ledger-sync/integration-yodlee'

export const ledgerSyncCommonConfig = LSProvider.config({
  // Turn providers into a map rather than array so that we can prevent from
  // a data-structure level multiple providers with the same `name` being passed in?
  providers: [
    // Core
    debugProvider,
    fsProvider,
    firebaseProvider,
    mongodbProvider,
    corePostgresProvider,
    airtableProvider,
    // Ledger
    plaidProvider,
    beancountProvider,
    importProvider,
    oneBrickProvider,
    tellerProvider,
    stripeProvider,
    rampProvider,
    wiseProvider,
    togglProvider,
    foreceiptProvider,
    yodleeProvider,
    splitwiseProvider,
    postgresProvider,
  ],

  // routerUrl: 'http://localhost:3010/api', // apiUrl?
  routerUrl: '/api', // apiUrl?
})

// console.log('Using config', ledgerSyncConfig) // Too verbose...
