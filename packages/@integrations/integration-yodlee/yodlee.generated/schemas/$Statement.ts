/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Statement = {
  properties: {
    apr: {
      type: 'number',
      description: `The APR applied to the balance on the credit card account, as available in the statement.<br><b>Note:</b> In case of variable APR, the APR available on the statement might differ from the APR available at the account-level.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>`,
      isReadOnly: true,
      format: 'double',
    },
    cashApr: {
      type: 'number',
      description: `The APR applicable to cash withdrawals on the credit card account.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>`,
      isReadOnly: true,
      format: 'double',
    },
    billingPeriodStart: {
      type: 'string',
      description: `The start date of the statement period.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>`,
      isReadOnly: true,
    },
    dueDate: {
      type: 'string',
      description: `The date by when the minimum payment is due to be paid.<br><b>Note:</b> The due date that appears in the statement may differ from the due date at the account-level.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>`,
      isReadOnly: true,
    },
    interestAmount: {
      type: 'Money',
      description: `The interest amount that is part of the amount due or the payment amount.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>`,
      isReadOnly: true,
    },
    statementDate: {
      type: 'string',
      description: `The date on which the statement is generated.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>`,
      isReadOnly: true,
    },
    cashAdvance: {
      type: 'Money',
      description: `Cash Advance is the amount that is withdrawn from credit card over the counter or from an ATM up to the available credit/cash limit.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>`,
      isReadOnly: true,
    },
    billingPeriodEnd: {
      type: 'string',
      description: `The end date of the statement period.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>`,
      isReadOnly: true,
    },
    principalAmount: {
      type: 'Money',
      description: `The principal amount that is part of the amount due or the payment amount.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>`,
      isReadOnly: true,
    },
    loanBalance: {
      type: 'Money',
      description: `The outstanding principal balance on the loan account.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>`,
      isReadOnly: true,
    },
    amountDue: {
      type: 'Money',
      description: `The total amount owed at the end of the billing period.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>`,
      isReadOnly: true,
    },
    accountId: {
      type: 'number',
      description: `Account to which the statement belongs to.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>`,
      isReadOnly: true,
      format: 'int64',
    },
    lastUpdated: {
      type: 'string',
      description: `The date when the account was last updated by Yodlee.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>`,
      isReadOnly: true,
    },
    isLatest: {
      type: 'boolean',
      description: `The field is set to true if the statement is the latest generated statement.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>`,
      isReadOnly: true,
    },
    minimumPayment: {
      type: 'Money',
      description: `<b>Credit Card:</b> The minimum amount that the consumer has to pay every month on the credit card account. Data provides an up-to-date information to the consumer.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>`,
      isReadOnly: true,
    },
    lastPaymentDate: {
      type: 'string',
      description: `The date on which the last payment was done during the billing cycle.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>`,
      isReadOnly: true,
    },
    lastPaymentAmount: {
      type: 'Money',
      description: `The last payment done for the previous billing cycle in the current statement period.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>`,
      isReadOnly: true,
    },
    id: {
      type: 'number',
      description: `Unique identifier for the statement.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>`,
      isReadOnly: true,
      format: 'int64',
    },
    newCharges: {
      type: 'Money',
      description: `New charges on the statement (i.e., charges since last statement to end of the billing period). Applicable to line of credit loan type.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>`,
      isReadOnly: true,
    },
  },
} as const;
