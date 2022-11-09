declare namespace QBO {
  /**
   * TODO: Finish populating me
   * https://developer.intuit.com/app/developer/qbo/docs/develop/webhooks/entities-and-operations-supported
   */
  export type EntityName =
    | 'Account'
    | 'Purchase'
    | 'JournalEntry'
    | 'Invoice'
    | 'Payment'
    | 'Bill'
    | 'BillPayment'
    | 'CreditMemo'
    | 'Deposit'
    | 'Transfer'
    | 'Vendor'
    | 'Customer'
    | 'Item'

  export interface TransactionTypes {
    Deposit: Deposit
    Purchase: Purchase
    JournalEntry: JournalEntry
    Payment: Payment
    Invoice: Invoice
  }
  export type TransactionTypeName = keyof TransactionTypes
  export type Transaction = TransactionTypes[keyof TransactionTypes]
  // Webhook / changes

  export interface CDCPayload {
    CDCResponse: Array<{QueryResponse: QueryResponse[]}>
    time: ISODateTime
  }

  export interface WebhookPayload {
    eventNotifications: Array<{
      realmId: string
      dataChangeEvent: {
        entities: Array<{
          name: EntityName
          id: string
          operation: 'Create' | 'Update' | 'Delete' | 'Merge' | 'Void'
          lastUpdated: ISODateTime
          /** deletedId (only for Merge events): The ID of the entity that was deleted and merged. */
          deletedId?: string
        }>
      }
    }>
  }

  // Query
  export interface QueryPayload {
    QueryResponse: QueryResponse
    time: string
  }

  export interface QueryResponse {
    maxResults: number
    startPosition: number
    totalCount?: number
    CompanyInfo?: CompanyInfo[]
    Account?: Account[]
    // Different types of transactions
    JournalEntry?: JournalEntry[]
    Purchase?: Purchase[]
    Deposit?: Deposit[]
    Payment?: Payment[]
    Invoice?: Invoice[]
    Bill?: unknown[]
    BillPayment?: unknown[]
    CreditMemo?: unknown[]
    Transfer?: unknown[]
    Vendor?: unknown[]
    Customer?: unknown[]
    Item?: unknown[]
  }

  // Company Info
  export interface GetCompanyInfoPayload {
    CompanyInfo: CompanyInfo
    time: string
  }

  export interface CompanyInfo {
    CompanyName: string
    LegalName: string
    CompanyAddr: CompanyAddr
    CustomerCommunicationAddr: CustomerCommunicationAddr
    LegalAddr: LegalAddr
    PrimaryPhone: PrimaryPhone
    CompanyStartDate: string
    FiscalYearStartMonth: string
    Country: string
    Email: Email
    WebAddr: WebAddr
    SupportedLanguages: string
    NameValue: NameValue[]
    domain: string
    sparse: boolean
    Id: string
    SyncToken: string
    MetaData: MetaData
  }

  export interface CompanyAddr {
    Id: string
    Line1: string
    City: string
    Country: string
    CountrySubDivisionCode: string
    PostalCode: string
  }

  export interface CustomerCommunicationAddr {
    Id: string
    Line1: string
    City: string
    Country: string
    CountrySubDivisionCode: string
    PostalCode: string
  }

  export interface LegalAddr {
    Id: string
    Line1: string
    City: string
    Country: string
    CountrySubDivisionCode: string
    PostalCode: string
  }

  export interface PrimaryPhone {
    FreeFormNumber: string
  }

  export interface Email {
    Address: string
  }

  export interface WebAddr {}

  export interface NameValue {
    Name: string
    Value: string
  }

  // Account

  export interface Account extends _BaseEntity {
    AccountSubType: string
    AccountType: string
    Active: boolean
    Classification: 'Asset' | 'Equity' | 'Expense' | 'Liability' | 'Revenue'
    CurrencyRef: CurrencyRef
    CurrentBalance: number
    CurrentBalanceWithSubAccounts: number
    FullyQualifiedName: string
    Name: string
    SubAccount: boolean
    SyncToken: string
    sparse: boolean
  }

  // Journal Entry

  export interface JournalEntry extends _BaseEntity {
    Adjustment: boolean
    sparse: boolean
    SyncToken: string
    DocNumber: string
    TxnDate: string
    CurrencyRef: CurrencyRef
    PrivateNote?: string
    Line: JournalEntryLine[]
  }

  export interface JournalEntryLine {
    Id: string
    Description: string
    Amount: number
    DetailType: string
    JournalEntryLineDetail: JournalEntryLineDetail
  }

  export interface JournalEntryLineDetail {
    PostingType: 'Debit' | 'Credit'
    Entity?: Entity
    AccountRef: AccountRef
  }

  // Purchase (aka expense?)
  export interface Purchase extends _BaseEntity {
    AccountRef: AccountRef
    PaymentMethodRef?: PaymentMethodRef
    PaymentType: string
    EntityRef?: EntityRef
    Credit?: boolean
    TotalAmt: number
    PurchaseEx: PurchaseEx
    sparse: boolean
    SyncToken: string
    TxnDate: string
    CurrencyRef: CurrencyRef
    PrivateNote: string
    Line: PurchaseLine[]
    DocNumber?: string
  }

  export interface PurchaseEx {
    any: Array<{
      name: string
      declaredType: string
      scope: string
      value: {
        Name: string
        Value: string
      }
      nil: boolean
      globalScope: boolean
      typeSubstituted: boolean
    }>
  }

  export interface PurchaseLine {
    Id: string
    Description: string
    Amount: number
    DetailType: string
    AccountBasedExpenseLineDetail: AccountBasedExpenseLineDetail
  }

  export interface AccountBasedExpenseLineDetail {
    AccountRef: AccountRef
    BillableStatus: string
    TaxCodeRef: TaxCodeRef
    CustomerRef?: CustomerRef
  }

  // Deposit
  export interface Deposit extends _BaseEntity {
    CurrencyRef: CurrencyRef
    DepositToAccountRef: DepositToAccountRef
    Line: Line[]
    PrivateNote: string
    SyncToken: string
    TotalAmt: number
    /** 2015-1-31 */
    TxnDate: string
    sparse: boolean
  }

  export interface DepositToAccountRef {
    name: string
    value: string
  }

  export interface Line {
    Amount: number
    DepositLineDetail: DepositLineDetail
    Description: string
    DetailType: string
    Id: string
    LineNum: number
  }

  export interface DepositLineDetail {
    AccountRef: AccountRef
    Entity?: Entity
  }

  // Invoice
  export interface Invoice extends _BaseEntity {
    AllowIPNPayment: boolean
    AllowOnlineACHPayment: boolean
    AllowOnlineCreditCardPayment: boolean
    AllowOnlinePayment: boolean
    ApplyTaxAfterDiscount: boolean
    Balance: number
    CurrencyRef: CurrencyRef
    CustomField: unknown[]
    CustomerRef: CustomerRef
    Deposit: number
    DocNumber: string
    DueDate: string
    EmailStatus: string
    Line: InvoiceLine[]
    LinkedTxn: LinkedTxn[]
    PrintStatus: string
    PrivateNote: string
    SyncToken: string
    TotalAmt: number
    TxnDate: string
    sparse: boolean
  }

  export interface InvoiceLine {
    Amount: number
    Description?: string
    DetailType: string
    Id?: string
    LineNum?: number
    SalesItemLineDetail?: SalesItemLineDetail
    SubTotalLineDetail?: SubTotalLineDetail
    DiscountLineDetail?: DiscountLineDetail
  }

  export interface SalesItemLineDetail {
    ItemRef: ItemRef
    Qty: number
    TaxCodeRef: TaxCodeRef
  }

  export interface ItemRef {
    name: string
    value: string
  }

  export interface SubTotalLineDetail {}

  export interface DiscountLineDetail {
    DiscountAccountRef: DiscountAccountRef
  }

  export interface DiscountAccountRef {
    name: string
    value: string
  }

  export interface LinkedTxn {
    TxnId: string
    TxnType: string
  }

  // Payment
  export interface Payment extends _BaseEntity {
    CurrencyRef: CurrencyRef
    CustomerRef: CustomerRef
    DepositToAccountRef: {value: string}
    Line: PaymentLine[]
    PrivateNote: string
    ProcessPayment: boolean
    SyncToken: string
    TotalAmt: number
    TxnDate: string
    UnappliedAmt: number
    sparse: boolean
  }

  export interface PaymentLine {
    Amount: number
    LineEx: LineEx
    LinkedTxn: LinkedTxn[]
  }

  export interface LineEx {
    any: Array<{
      declaredType: string
      globalScope: boolean
      name: string
      nil: boolean
      scope: string
      typeSubstituted: boolean
      value: {
        Name: string
        Value: string
      }
    }>
  }

  // Common types

  export interface _BaseEntity {
    Id: string
    /** QBO */
    domain: string
    // https://developer.intuit.com/app/developer/qbo/docs/develop/explore-the-quickbooks-online-api/change-data-capture#using-change-data-capture
    status?: 'deleted'
    Metadata: MetaData
  }

  export interface Entity {
    Type: string
    EntityRef: EntityRef
  }

  export interface MetaData {
    CreateTime: string
    LastUpdatedTime: string
  }

  export interface CurrencyRef {
    name: string
    value: string
  }

  export interface EntityRef {
    value: string
    name: string
    type?: string
  }

  export interface AccountRef {
    value: string
    name: string
  }

  export interface TaxCodeRef {
    value: string
  }

  export interface CustomerRef {
    value: string
    name: string
  }

  export interface PaymentMethodRef {
    value: string
  }

  // Report Types
  export interface ReportPayload {
    Header: Header
    Columns: Columns
    Rows: Rows
  }

  export interface Header {
    Time: string
    ReportName: string
    DateMacro: string
    StartPeriod: string
    EndPeriod: string
    Currency: string
    Option: Option[]
  }

  export interface Option {
    Name: string
    Value: string
  }

  export interface Columns {
    Column: Column[]
  }

  export interface Column {
    ColTitle: string
    ColType: string
  }

  export interface Rows {
    Row: Row[]
  }

  export interface Row {
    ColData: ColDaum[]
    type: string
  }

  export interface ColDaum {
    value: string
    id?: string
  }
}
