import {implementProxyFn} from '@ledger-sync/util';
import { $airtable } from './airtableConnection';
import Airtable from 'airtable'
implementProxyFn($airtable, () => Airtable)