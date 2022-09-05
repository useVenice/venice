import {$airtable} from './AirtableClient'
import {implementProxyFn} from '@ledger-sync/util'
import Airtable from 'airtable'

implementProxyFn($airtable, () => Airtable)
