/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type EnrichedTransaction = {
  /**
   * The account's container.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br><b>Applicable Values</b><br>
   */
  readonly container?:
    | 'bank'
    | 'creditCard'
    | 'investment'
    | 'insurance'
    | 'loan'
    | 'reward'
    | 'bill'
    | 'realEstate'
    | 'otherAssets'
    | 'otherLiabilities'
  /**
   * A unique ID that the provider site has assigned to the transaction. The source ID is only available for the pre-populated accounts.<br>Pre-populated accounts are the accounts that the FI customers shares with Yodlee, so that the user does not have to add or aggregate those accounts.
   */
  readonly sourceId?: string
  /**
   * City of the merchant.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
   */
  readonly merchantCity?: string
  /**
   * The high level category assigned to the transaction. The supported values are provided by the GET transactions/categories. <br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
   */
  readonly highLevelCategoryId?: number
  /**
   * The id of the detail category that is assigned to the transaction. The supported values are provided by GET transactions/categories.<br><br><b>Applicable containers</b>: bank,creditCard<br>
   */
  readonly detailCategoryId?: number
  /**
   * The nature of the transaction, i.e., deposit, refund, payment, etc.<br><b>Note</b>: The transaction type field is available only for the United States, Canada, United Kingdom, and India based provider sites. <br><br><b>Applicable containers</b>: bank,creditCard,investment<br>
   */
  readonly type?:
    | 'CREDIT'
    | 'DEBIT'
    | 'BUY'
    | 'SELL'
    | 'DIVIDEND_PAYMENT'
    | 'DIVIDEND_REINVESTMENT'
    | 'MISCELLANEOUS_INCOME'
    | 'INTEREST_INCOME'
    | 'INTEREST_REINVESTMENT'
    | 'LONG_TERM_CAPITAL_GAINS_DISTRIBUTION'
    | 'REINVEST_LONG_TERM_CAPITAL_GAINS'
    | 'SHORT_TERM_CAPITAL_GAINS_DISTRIBUTION'
    | 'REINVEST_SHORT_TERM_CAPITAL_GAINS'
    | 'SHARES_IN'
    | 'SHARES_OUT'
    | 'TRANSFER_CASH_IN'
    | 'TRANSFER_CASH_OUT'
    | 'STOCK_SPLIT'
    | 'RETURN_OF_CAPITAL'
    | 'MISCELLANEOUS_EXPENSE'
    | 'TRANSFER_SHARES_IN'
    | 'TRANSFER_SHARES_OUT'
    | 'MARGIN_INTEREST_EXPENSE'
    | 'REMINDER'
    | 'CORPORATE_ACQUISITION'
    | 'STOCK_DIVIDEND'
    | 'SHORT_SELL'
    | 'BOND_CALL'
    | 'BOND_MATURES'
    | 'BUY_TO_COVER'
    | 'BUY_OPTION'
    | 'SELL_OPTION'
    | 'EXERCISE_OPTION'
    | 'ASSIGN_OPTION'
    | 'EXPIRE_OPTION'
    | 'OTHER'
    | 'SWEEP'
    | 'CAPITAL_GAINS_REINVESTED'
    | '_1035_EXCHANGE'
    | '_401K_CONTRIBUTION'
    | '_401K_EMPLOYER_CONTRIBUTION'
    | 'LOAN_DISTRIBUTION'
    | 'LOAN_PAYMENT'
    | 'PENALTY'
    | 'ACCOUNT_FEE'
    | 'ACCOUNT_MAINTENANCE_FEE'
    | 'ACCUMULATION'
    | 'ACH_OUT'
    | 'ADJUSTED_BUY'
    | 'ADJUSTED_SELL'
    | 'ADMINISTRATIVE_FEE'
    | 'ANNUITY_CREDIT'
    | 'ATM_FEE'
    | 'ATM_WITHDRAWAL'
    | 'ATM_WITHDRAWAL_FEE'
    | 'ATM_WITHDRAWAL_FEE_CREDIT'
    | 'AUTOMATIC_INVESTMENT'
    | 'BAD_CHECK'
    | 'BILL_PAY'
    | 'BILL_PAY_IN'
    | 'BILL_PAY_OUT'
    | 'BUY_ACCRUED_INTEREST'
    | 'BUY_TO_CLOSE'
    | 'BUY_TO_OPEN'
    | 'CAPITAL_GAINS_RECIEVED'
    | 'CHARGE'
    | 'CHARGE_CREDIT'
    | 'CHECK'
    | 'CHECKBOOK_REORDER_FEE'
    | 'CREDIT_IN_LIEU_OF_FRACTIONAL_SHARE'
    | 'CS_ADJUSTMENT'
    | 'DEATH_BENEFIT_PAYOUT'
    | 'DEFERRED_COMPENSATION_CONTRIBUTION'
    | 'DEFERRED_COMPENSATION_DISTRIBUTION'
    | 'DEPOSIT'
    | 'DIRECT_DEPOSIT'
    | 'EDUCATIONAL_PLAN_CONTRIBUTION'
    | 'ESOP_ALLOCATION'
    | 'FEDERAL_TAX_FREE_DIVIDEND'
    | 'FEDEX_FEE'
    | 'FED_TAX_WITHHELD'
    | 'FOREIGN_TAX'
    | 'FOREIGN_TAX_CREDIT'
    | 'FRACTIONAL_SHARE_LIQUIDATION'
    | 'FUND_EXCHANGE'
    | 'FUND_EXPENSE'
    | 'IRA_CONTRIBUTION'
    | 'IRA_DISTRIBUTION'
    | 'IRA_NON_QUALIFIED_DISTRIBUTION'
    | 'MERGER'
    | 'MISC_CREDIT'
    | 'MISC_JRL_CASHTO_MARGIN'
    | 'MISC_JRL_MARGIN_TO_CASH'
    | 'MMF_DIVIDEND'
    | 'MMF_IN'
    | 'MMF_LIQ'
    | 'MMF_REIN'
    | 'MMF_SWEEP'
    | 'MMF_TRANSACTION'
    | 'MONEY_FUNDS_JOURNAL_CASH_TO_MARGIN'
    | 'MONEY_FUNDS_JOURNAL_MARGIN_TO_CASH'
    | 'MORTALITY_AND_EXPENSE_RISK_CHARGE'
    | 'NAME_CHANGE'
    | 'NSF_FEE'
    | 'ORDER_OUT'
    | 'ORDER_OUT_FEE'
    | 'OTHER_ANNUITY_FEE'
    | 'PAYOUT'
    | 'REORGANIZATION_CHARGE'
    | 'RETURNED_CHECK_FEE'
    | 'ROLLOVER_CONTRIBUTION'
    | 'ROTH_CONTRIBUTION'
    | 'RTQ_FEE'
    | 'SELL_ACCRUED_INTEREST'
    | 'SELL_TO_CLOSE'
    | 'SELL_TO_OPEN'
    | 'SEP_CONTRIBUTION'
    | 'SIMPLE_PLAN_CONTRIBUTION'
    | 'SPINOFF'
    | 'STATE_TAX_FREE_DIVIDEND'
    | 'STATE_TAX_WITHHELD'
    | 'STAX'
    | 'STOCK_FUND_OPTION_JOURNAL_CASH_TO_MARGIN'
    | 'STOCK_FUND_OPTION_JOURNAL_MARGIN_TO_CASH'
    | 'STOCK_OPTION_EXERCISE'
    | 'STOCK_OPTION_WITHHOLDING'
    | 'SURRENDER_CHARGE'
    | 'SYMBOL_CHANGE'
    | 'TAX_FREE_DIVIDEND'
    | 'WIRE_FEE'
    | 'WIRE_FUNDS_IN'
    | 'WIRE_FUNDS_OUT'
    | 'WORTHLESS_SECURITIES'
    | '_529_PLAN_CONTRIBUTION'
    | 'ADJUSTED_ASSIGN'
    | 'REVERSAL'
    | 'DVP'
    | 'RVP'
    | 'ADJUSTMENT'
    | 'ADJUSTED_CREDIT'
    | 'ADJUSTED_DEBIT'
    | 'TENDERED'
    | 'ESOP_ALLOCATION_1'
    | 'EXCESS_CONTRIBUTION'
    | 'RECHARACTERIZATION'
    | 'CONVERSION'
    | 'ROLLOVER_TO_QUAL'
    | 'FEDERAL_TAX_FREE_INTEREST_INCOME'
    | 'STATE_TAX_FREE_INTEREST_INCOME'
    | 'FORFEITURE'
    | 'WITHDRAWAL'
    | 'LOAN_WITHDRAWAL'
    | 'BALANCE_FORWARD'
    | 'GENERIC_CONTRIBUTION'
    | 'CAPITAL_CALLS'
    | 'DISTRIBUTIONS_OUT'
    | 'PRINCIPAL_PAYMENT'
  /**
   * State of the merchant.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
   */
  readonly merchantState?: string
  /**
   * An unique identifier for the transaction. The combination of the id and account container are unique in the system. <br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
   */
  readonly transactionId?: number
  /**
   * The name of the merchant.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
   */
  readonly merchantName?: string
  /**
   * Identifier of the merchant.<br><br><b>Applicable containers</b>: bank,creditCard<br>
   */
  readonly merchantId?: string
  /**
   * The transaction description that appears at the FI site may not be self-explanatory, i.e., the source, purpose of the transaction may not be evident. Yodlee attempts to simplify and make the transaction meaningful to the consumer, and this simplified transaction description is provided in the simple description field.Note: The simple description field is available only in the United States, Canada, United Kingdom, and India.<br><br><b>Applicable containers</b>: bill, creditCard, insurance, loan<br>
   */
  readonly simpleDescription?: string
  /**
   * The transaction subtype field provides a detailed transaction type. For example, purchase is a transaction type and the transaction subtype field indicates if the purchase was made using a debit or credit card.<br><b>Note</b>: The transaction subtype field is available only in the United States, Canada, United Kingdom, and India.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
   */
  readonly subType?:
    | 'OVERDRAFT_CHARGE'
    | 'ONLINE_PURCHASE'
    | 'TAX_PAYMENT'
    | 'PAYMENT_BY_CHECK'
    | 'ATM_CASH_WITHDRAWAL'
    | 'SERVICE_CHARGE'
    | 'RETURNED_CHECK_CHARGE'
    | 'STOP_PAYMENT_CHARGE'
    | 'CONVENIENCE_FEE'
    | 'AUTO_LOAN'
    | 'HOME_LOAN_MORTGAGE'
    | 'RECURRING_SUBSCRIPTION_PAYMENT'
    | 'INTEREST'
    | 'PAYMENT'
    | 'PURCHASE'
    | 'REFUND'
    | 'TRANSFER'
    | 'FINANCE_CHARGE'
    | 'OTHER_CHARGES_FEES'
    | 'ANNUAL_FEE'
    | 'DEPOSIT'
    | 'DIRECT_DEPOSIT_SALARY'
    | 'INVESTMENT_INCOME_CASH'
    | 'SSA'
    | 'REWARDS'
    | 'TAX_REFUND'
    | 'CREDIT_CARD_PAYMENT'
    | 'INSURANCE_PAYMENT'
    | 'UTILITIES_PAYMENT'
    | 'CHILD_SUPPORT'
    | 'LOAN'
    | 'PERSONAL_LOAN'
    | 'STUDENT_LOAN'
    | 'REIMBURSEMENT'
    | 'BALANCE_TRANSFER'
    | 'OVERDRAFT_PROTECTION'
    | 'CREDIT'
    | 'NSF_FEES'
  /**
   * Country of the merchant.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
   */
  readonly merchantCountry?: string
  /**
   * The id of the category assigned to the transaction. This is the id field of the transaction category resource. The supported values are provided by the GET transactions/categories.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
   */
  readonly categoryId?: number
}
