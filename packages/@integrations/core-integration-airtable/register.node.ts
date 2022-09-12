import Airtable from 'airtable'

import {implementProxyFn} from '@ledger-sync/util'

import {$airtable} from './AirtableClient'

implementProxyFn($airtable, () => Airtable)
