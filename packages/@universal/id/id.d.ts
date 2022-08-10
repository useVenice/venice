declare namespace Id {
  // External IDs (used by ledger sync providers only)
  type external = BrandedString<'external'>

  // Simple IDs
  type conn = BrandedString<'conn'>
  type ldgr = BrandedString<'ldgr'>
  type op = BrandedString<'op'>
  type usr = BrandedString<'usr'>
  type ntf = BrandedString<'ntf'>
  type acct = BrandedString<'acct'>
  type comm = BrandedString<'comm'>
  type evt = BrandedString<'evt'>
  type lbl = BrandedString<'lbl'>
  type note = BrandedString<'note'>
  type rule = BrandedString<'rule'>
  type sd = BrandedString<'sd'>
  type sr = BrandedString<'sr'>
  type sv = BrandedString<'sv'>
  type txn = BrandedString<'txn'>
  type post = BrandedString<'post'>
  type bal = BrandedString<'bal'>
  type prce = BrandedString<'prce'>

  // Compound IDs
  type txn_post = BrandedString<'txn_post'> // Just added
  type acct_bal = BrandedString<'acct_bal'> // Just added
  type comm_prce = BrandedString<'comm_prce'> // Just added
  type usr_ntf = BrandedString<'usr_ntf'>
  type ldgr_acct = BrandedString<'ldgr_acct'>
  type ldgr_comm = BrandedString<'ldgr_comm'>
  type ldgr_evt = BrandedString<'ldgr_evt'>
  type ldgr_lbl = BrandedString<'ldgr_lbl'>
  type ldgr_note = BrandedString<'ldgr_note'>
  type ldgr_rule = BrandedString<'ldgr_rule'>
  type ldgr_sd = BrandedString<'ldgr_sd'>
  type ldgr_sr = BrandedString<'ldgr_sr'>
  type ldgr_sv = BrandedString<'ldgr_sv'>
  type ldgr_txn = BrandedString<'ldgr_txn'>
  type ldgr_txn_post = BrandedString<'ldgr_txn_post'>
  type ldgr_acct_bal = BrandedString<'ldgr_acct_bal'>
  type ldgr_comm_prce = BrandedString<'ldgr_comm_prce'>

  // MARK: Helpers

  interface Simple {
    connections: conn
    ledgers: ldgr
    notifications: ntf
    operations: op
    users: usr

    accounts: acct
    commodities: comm
    events: evt
    labels: lbl
    notes: note
    rules: rule
    smartDashboards: sd
    smartReports: sr
    smartViews: sv
    transactions: txn

    postings: post
    balances: bal
    prices: prce
  }

  interface Compound {
    notifications: usr_ntf

    accounts: ldgr_acct
    commodities: ldgr_comm
    events: ldgr_evt
    labels: ldgr_lbl
    notes: ldgr_note
    rules: ldgr_rule
    smartDashboards: ldgr_sd
    smartReports: ldgr_sr
    smartViews: ldgr_sv
    transactions: ldgr_txn

    postings: ldgr_txn_post
    balances: ldgr_acct_bal
    prices: ldgr_comm_prce
  }

  interface CompoundTuple {
    notifications: [usr, ntf]

    accounts: [ldgr, acct]
    commodities: [ldgr, comm]
    events: [ldgr, evt]
    labels: [ldgr, lbl]
    notes: [ldgr, note]
    rules: [ldgr, rule]
    smartDashboards: [ldgr, sd]
    smartReports: [ldgr, sr]
    smartViews: [ldgr, sv]
    transactions: [ldgr, txn]

    postings: [ldgr, txn, post]
    balances: [ldgr, acct, bal]
    prices: [ldgr, comm, prce]
  }

  type Global = {
    [TRepoName in keyof Simple]: TRepoName extends keyof Compound
      ? Compound[TRepoName]
      : Simple[TRepoName]
  }

  type AnySimple = Simple[keyof Simple]
  type SimpleBrand = AnySimple['__brand__']

  type AnyCompound = Compound[keyof Compound]
  type CompoundBrand = AnyCompound['__brand__']

  type AnyGlobal = Global[keyof Global]
  type GlobalBrand = AnyGlobal['__brand__']

  type ForBrand<TBrand extends SimpleBrand | CompoundBrand> =
    BrandedString<TBrand>

  //

  type SimpleBrandMap = {
    [TRepoName in keyof Simple]: Simple[TRepoName]['__brand__']
  }
  type SimpleBrandMapInverse = import('@alka/util').Invert<SimpleBrandMap>
  type RepoNameForSimple<TId> = TId extends AnySimple
    ? SimpleBrandMapInverse[TId['__brand__']]
    : string

  type CompoundBrandMap = {
    [TRepoName in keyof Compound]: Compound[TRepoName]['__brand__']
  }
  type CompoundBrandMapInverse = import('@alka/util').Invert<CompoundBrandMap>
  type RepoNameForCompound<TId> = TId extends AnyCompound
    ? CompoundBrandMapInverse[TId['__brand__']]
    : string

  type GlobalBrandMap = {
    [TRepoName in keyof Global]: Global[TRepoName]['__brand__']
  }
  type GlobalBrandMapInverse = import('@alka/util').Invert<GlobalBrandMap>
  type RepoNameForGlobal<TId> = TId extends AnyGlobal
    ? GlobalBrandMapInverse[TId['__brand__']]
    : string

  //

  type JoinId<TId0, TId1, TId2 = never> = Compound[{
    [R in keyof CompoundTuple]: [TId2] extends [never]
      ? CompoundTuple[R] extends [TId0, TId1]
        ? R
        : never
      : CompoundTuple[R] extends [TId0, TId1, TId2]
      ? R
      : never
  }[keyof CompoundTuple]]

  type SplitId<TId> = TId extends AnyCompound
    ? CompoundBrandMapInverse[TId['__brand__']] extends keyof CompoundTuple
      ? CompoundTuple[CompoundBrandMapInverse[TId['__brand__']]]
      : never
    : [TId]

  type GlobalFor<TId> = TId extends AnySimple
    ? SimpleBrandMapInverse[TId['__brand__']] extends keyof Compound
      ? Compound[SimpleBrandMapInverse[TId['__brand__']]]
      : TId
    : TId

  //

  type SimpleForCollectionName<
    TRepoName extends import('@alka/firebase').CollectionName = import('@alka/firebase').CollectionName,
  > = TRepoName extends keyof Simple ? Simple[TRepoName] : never

  type SimpleForRepoName<TRepoName extends Raw.RepoName = Raw.RepoName> =
    TRepoName extends keyof Simple ? Simple[TRepoName] : never

  type CompoundForCollectionName<
    TRepoName extends import('@alka/firebase').CollectionName = import('@alka/firebase').CollectionName,
  > = TRepoName extends keyof Compound ? Compound[TRepoName] : never

  type CompoundForRepoName<TRepoName extends Raw.RepoName = Raw.RepoName> =
    TRepoName extends keyof Compound ? Compound[TRepoName] : never

  type GlobalForCollectionName<
    TRepoName extends import('@alka/firebase').CollectionName = import('@alka/firebase').CollectionName,
  > = TRepoName extends keyof Global ? Global[TRepoName] : never

  type GlobalForRepoName<TRepoName extends Raw.RepoName = Raw.RepoName> =
    TRepoName extends keyof Global ? Global[TRepoName] : never
}
