import {A} from '@alka/util'

// This should be consolidated except two different plaid versions are used
// So we should copy for now until we are ready...

type Nullish<T> = {
  [P in keyof T]?: T[P] | null
}

// TODO: Make me even better
export function getPlaidAccountType(
  a: Nullish<Pick<Plaid.Account, 'subtype' | 'type'>>,
): Standard.AccountType {
  switch (a.subtype as Plaid.AccountTypes[keyof Plaid.AccountTypes]) {
    case 'credit card':
      return 'liability/credit_card'
    case 'checking':
    case 'savings':
      return 'asset/bank'
    case 'paypal':
      return 'asset/digital_wallet'
    // Is this even right?
    // What do we do about retirement stuff?
    case 'hsa':
      return 'asset/insurance'
  }
  switch (a.type as keyof Plaid.AccountTypes) {
    case 'depository':
      return 'asset/bank'
    case 'investment':
      return 'asset/brokerage'
    case 'loan':
      return 'liability/personal_loan'
    case 'credit':
      return 'liability'
    // eslint-disable-next-line unicorn/no-useless-switch-case
    case 'other':
    default:
      return 'asset'
  }
}

export function getPlaidAccountShortName(
  a: Partial<Pick<Plaid.Account, 'name' | 'official_name'>>,
  institution?: Pick<Plaid.Institution, 'institution_id'>,
) {
  // #special Special case Chase CCs, `name` equals `CREDIT CARD`, while official_name is actually
  // kind of meaningful
  if (a.name?.toUpperCase() === 'CREDIT CARD' && a.official_name != null) {
    return a.official_name
  }

  // ins_10 is American Express
  // name: FIRST LAST -01006
  // official_name: Hilton Honors Business Card
  if (institution?.institution_id === 'ins_10') {
    return a.official_name || a.name || ''
  }

  // It'll be long, but at least clear.
  if (a.name && a.official_name) {
    return `${a.official_name} (${a.name})`
  }

  // For Mercury, `.name` can equal to `Pilot` while official_name is always
  // `Mercury Checking` causing conflict.
  return a.name || a.official_name || ''
}

export function getPlaidAccountFullName(
  account: Partial<Pick<Plaid.Account, 'name' | 'official_name' | 'mask'>>,
  institution?: Pick<Plaid.Institution, 'institution_id'>,
) {
  const shortName = getPlaidAccountShortName(account, institution)
  return account.mask && !shortName.includes(account.mask)
    ? `${shortName} - ${account.mask}`
    : shortName
}

export function getPlaidAccountBalance(
  account: Nullish<Pick<Plaid.Account, 'type'>> & {
    balances?: Nullish<Plaid.Account['balances']>
  },
  type: 'available' | 'current' | 'limit',
) {
  const inverseSign = account.type === 'credit' || account.type === 'loan'
  const unit = account.balances?.['iso_currency_code'] as string | null

  return account.balances?.[type] != null && unit != null
    ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      A(account.balances[type]! * (inverseSign ? -1 : 1), unit)
    : null
}

export function plaidUnitForSecurity(s: Plaid.Security) {
  return (s.ticker_symbol?.split(':').pop() ??
    s.institution_security_id ??
    '') as Unit
}

export function plaidUnitForCurrency(input: {
  iso_currency_code: string | null
  unofficial_currency_code: string | null
}) {
  return (input.iso_currency_code ||
    input.unofficial_currency_code ||
    '') as Unit
}

export function plaidMapHolding(
  h: Plaid.Holding & {security?: Plaid.Security},
): Standard.Holding | null {
  if (h.quantity == null || !h.security) {
    return null
  }
  const curr = h.iso_currency_code || h.unofficial_currency_code || ''
  const amount = (() => {
    switch (h.security.type as Plaid.SecurityType) {
      case 'fixed income':
      case 'mutual fund':
      case 'etf':
      case 'equity':
        return A(h.quantity, plaidUnitForSecurity(h.security))
      // eslint-disable-next-line unicorn/no-useless-switch-case
      case 'cash':
      default:
        return A(h.quantity, plaidUnitForCurrency(h.security))
    }
  })()
  return {
    ...amount,
    costBasis: h.cost_basis ? A(h.cost_basis, curr) : undefined,
    lastQuote: h.institution_price ? A(h.institution_price, curr) : undefined,
    lastQuoteDate: h.institution_price_as_of,
  }
}

export interface PlaidClientCredentials {
  client_id: string
  /** No longer used by the api */
  public_key: string
  secrets: Partial<{[K in Plaid.EnvName]: string}>
  urls: Partial<{[K in Plaid.EnvName]: string}>
}

export function inferPlaidEnvFromToken(
  publicOrAccessToken: string,
): Plaid.EnvName | null {
  const regex = /^(access|public)-(sandbox|development|production)-/
  const match = regex.exec(publicOrAccessToken)

  if (match) {
    return match[2] as Plaid.EnvName
  }

  return null
}

export function plaidIsInvestmentTransaction(
  txn: Plaid.Transaction,
): txn is Plaid.InvestmentTransaction {
  return 'investment_transaction_id' in txn
}

export function plaidCatchInvestmentNotSupported(error: unknown) {
  const err = error as Plaid.ErrorShape
  if (
    // Probably an error like this, which will occur until we have investment enabled
    // on production
    // client is not authorized to access the following products: ["investments"]
    err.error_code !== 'INVALID_PRODUCT' &&
    // "error_message": "the following products are not supported by this institution: [\"investments\"]",
    err.error_code !== 'PRODUCTS_NOT_SUPPORTED'
  ) {
    throw err
  }
  console.warn(err.error_message)
  return null
}
