import type {EnumOf} from '@ledger-sync/util'

// Use this for Coin Keeper CSV Format
export function extractExternalId(id: Id.AnySimple, providerName: string) {
  const regex = new RegExp(
    `^(${Object.values(ID_PREFIXES).join('|')})_${providerName}_(.+)`,
  )
  return (regex.exec(id)?.[2] ?? null) as Id.external | null
}

const ID_PREFIXES: EnumOf<Id.SimpleBrand> = {
  acct: 'acct',
  bal: 'bal',
  comm: 'comm',
  conn: 'conn',
  evt: 'evt',
  lbl: 'lbl',
  ldgr: 'ldgr',
  note: 'note',
  ntf: 'ntf',
  op: 'op',
  post: 'post',
  prce: 'prce',
  rule: 'rule',
  sd: 'sd',
  sr: 'sr',
  sv: 'sv',
  txn: 'txn',
  usr: 'usr',
}
