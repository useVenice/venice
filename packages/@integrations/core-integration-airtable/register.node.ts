import {implementProxyFn} from '@ledger-sync/util';
import { $airtable } from './AirtableClient';
import Airtable from 'airtable'
implementProxyFn($airtable, () => Airtable)
