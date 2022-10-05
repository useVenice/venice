// Use this for Coin Keeper CSV Format
export function extractExternalId(id: string, providerName: string) {
  const regex = new RegExp(
    `^(${Object.values(ID_PREFIXES).join('|')})_${providerName}_(.+)`,
  )
  return (regex.exec(id)?.[2] ?? null) as ExternalId | null
}

const ID_PREFIXES = {
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
