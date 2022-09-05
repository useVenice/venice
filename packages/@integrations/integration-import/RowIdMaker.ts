import {extractExternalId} from './import-format-utils'
import {makeUlid, md5Hash, stableStringify} from '@ledger-sync/util'

export class RowIdMaker {
  readonly ids = new Set<string>()

  uniqueIdForRow(row: unknown) {
    const baseId = md5Hash(stableStringify(row))
    let id = baseId
    let prefix = 2
    while (this.ids.has(id)) {
      id = `${baseId}-${prefix}`
      prefix++
    }
    this.ids.add(id)
    return id as Id.external
  }

  // Hashing json of the row is not a reliable way to determine duplicate transactions
  // leads to false positives and many unreliable behavior. We are instead going to rely on
  // either explicit IDs or no Id at all
  static idForRow(_row: unknown) {
    if (_row && typeof _row === 'object') {
      const row = _row as Record<string, unknown>
      const id = row['id'] ?? row['Id'] ?? row['ID']
      if (id) {
        return id as Id.external
      }
    }
    return makeUlid()
  }
  // Use this for Coin Keeper Format
  static uniqueIdForAccount(
    accountExternalId: Id.external,
    name: string | null,
  ) {
    let id = extractExternalId(
      accountExternalId as unknown as Id.AnySimple,
      'csv',
    )
    if (id) {
      console.warn('Unexpected accountExternalId', accountExternalId)
    } else {
      id = accountExternalId
    }
    if (name == null) {
      return id as Id.external
    }
    return md5Hash(`${id}_${name}`) as Id.external
  }
}
