import Airtable from 'airtable'

import {implementProxyFn} from '@usevenice/util'

import {$airtable} from './AirtableClient'

implementProxyFn($airtable, () => Airtable)
