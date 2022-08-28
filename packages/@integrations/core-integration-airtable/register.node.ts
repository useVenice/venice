import {implementProxyFn} from '@ledger-sync/util'
import Airtable from 'airtable'
import {$airtable} from './AirtableClient'

implementProxyFn($airtable, () => Airtable)
