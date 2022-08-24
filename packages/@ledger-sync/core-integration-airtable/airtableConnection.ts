import {defineProxyFn, z, zFunction} from '@ledger-sync/util'
import type {Base} from 'airtable'

export const zAirtableConnectionSettings = z.object({
  apiKey: z.string(),
  airtableBase: z.string(),
})
export const $airtable =
  defineProxyFn<() => typeof import('airtable')>('$airtable')
export const airtableConnection = zFunction(
  zAirtableConnectionSettings,
  ({apiKey, airtableBase}) => {
    const Airtable = $airtable()
    let base: Base
    const initBase = () => {
      base = new Airtable({apiKey}).base(airtableBase)
    }
    return {
      initBase,
      insertData: zFunction(
        z.object({data: z.any(), entityName: z.string()}),
        async ({data, entityName}) => {
          try {
            // TODO: Need to find a way to prevent duplicate records 
            // Refs:  https://community.airtable.com/t/solved-record-duplication-detection-deduping-and-duplicate-merging/340/5
            await base(titleCase(entityName)).create([data])
          } catch (error) {
            console.log(error)
          }
        },
      ),
    }
  },
)

function titleCase(str: string): string {
  return str.toLowerCase().replace(/\b\w/g, (s) => s.toUpperCase())
}
