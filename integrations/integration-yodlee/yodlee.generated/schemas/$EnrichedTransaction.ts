/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $EnrichedTransaction = {
  properties: {
    container: {
      type: 'Enum',
      isReadOnly: true,
    },
    sourceId: {
      type: 'string',
      description: `A unique ID that the provider site has assigned to the transaction. The source ID is only available for the pre-populated accounts.<br>Pre-populated accounts are the accounts that the FI customers shares with Yodlee, so that the user does not have to add or aggregate those accounts.`,
      isReadOnly: true,
    },
    merchantCity: {
      type: 'string',
      description: `City of the merchant.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>`,
      isReadOnly: true,
    },
    highLevelCategoryId: {
      type: 'number',
      description: `The high level category assigned to the transaction. The supported values are provided by the GET transactions/categories. <br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>`,
      isReadOnly: true,
      format: 'int64',
    },
    detailCategoryId: {
      type: 'number',
      description: `The id of the detail category that is assigned to the transaction. The supported values are provided by GET transactions/categories.<br><br><b>Applicable containers</b>: bank,creditCard<br>`,
      isReadOnly: true,
      format: 'int64',
    },
    type: {
      type: 'Enum',
      isReadOnly: true,
    },
    merchantState: {
      type: 'string',
      description: `State of the merchant.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>`,
      isReadOnly: true,
    },
    transactionId: {
      type: 'number',
      description: `An unique identifier for the transaction. The combination of the id and account container are unique in the system. <br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>`,
      isReadOnly: true,
      format: 'int64',
    },
    merchantName: {
      type: 'string',
      description: `The name of the merchant.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>`,
      isReadOnly: true,
    },
    merchantId: {
      type: 'string',
      description: `Identifier of the merchant.<br><br><b>Applicable containers</b>: bank,creditCard<br>`,
      isReadOnly: true,
    },
    simpleDescription: {
      type: 'string',
      description: `The transaction description that appears at the FI site may not be self-explanatory, i.e., the source, purpose of the transaction may not be evident. Yodlee attempts to simplify and make the transaction meaningful to the consumer, and this simplified transaction description is provided in the simple description field.Note: The simple description field is available only in the United States, Canada, United Kingdom, and India.<br><br><b>Applicable containers</b>: bill, creditCard, insurance, loan<br>`,
      isReadOnly: true,
    },
    subType: {
      type: 'Enum',
      isReadOnly: true,
    },
    merchantCountry: {
      type: 'string',
      description: `Country of the merchant.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>`,
      isReadOnly: true,
    },
    categoryId: {
      type: 'number',
      description: `The id of the category assigned to the transaction. This is the id field of the transaction category resource. The supported values are provided by the GET transactions/categories.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>`,
      isReadOnly: true,
      format: 'int64',
    },
  },
} as const
