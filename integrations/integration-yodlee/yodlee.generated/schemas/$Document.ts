/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Document = {
  properties: {
    accountID: {
      type: 'number',
      description: `The unique identifier for the account. The account ID to which the document is linked.<br><br><b>Applicable containers</b>: bank, investment, creditCard, loan, insurance<br>`,
      isReadOnly: true,
      format: 'int64',
    },
    lastUpdated: {
      type: 'string',
      description: `Indicates the date and time the document was last updated.<br><br><b>Applicable containers</b>: bank, investment, creditCard, loan, insurance<br>`,
      isReadOnly: true,
    },
    formType: {
      type: 'string',
      description: `Indicates the type of the tax form.<br><br><b>Applicable containers</b>: bank, investment, creditCard, loan, insurance<br>`,
      isReadOnly: true,
    },
    docType: {
      type: 'Enum',
      isReadOnly: true,
    },
    name: {
      type: 'string',
      description: `Indicates the name of the document.<br><br><b>Applicable containers</b>: bank, investment, creditCard, loan, insurance<br>`,
      isReadOnly: true,
    },
    id: {
      type: 'string',
      description: `The document's primary key and unique identifier.<br><br><b>Applicable containers</b>: bank, investment, creditCard, loan, insurance<br>`,
      isReadOnly: true,
    },
    source: {
      type: 'string',
      description: `Indicates the source of the document download.<br><br><b>Applicable containers</b>: bank, investment, creditCard, loan, insurance<br>`,
      isReadOnly: true,
    },
    status: {
      type: 'string',
      description: `Indicates the status of the document download.<br><br><b>Applicable containers</b>: bank, investment, creditCard, loan, insurance<br>`,
      isReadOnly: true,
    },
  },
} as const
