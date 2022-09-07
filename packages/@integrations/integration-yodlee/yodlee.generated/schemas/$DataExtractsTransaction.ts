/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $DataExtractsTransaction = {
  properties: {
    date: {
      type: 'string',
      description: `The value provided will be either postDate or transactionDate. postDate takes higher priority than transactionDate, except for the investment container as only transactionDate is available. The availability of postDate or transactionDate depends on the provider site.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>`,
      isReadOnly: true,
    },
    sourceId: {
      type: 'string',
      description: `A unique ID that the provider site has assigned to the transaction. The source ID is only available for the pre-populated accounts.<br>Pre-populated accounts are the accounts that the FI customers shares with Yodlee, so that the user does not have to add or aggregate those accounts.`,
      isReadOnly: true,
    },
    symbol: {
      type: 'string',
      description: `The symbol of the security being traded.<br><b>Note</b>: The settle date field applies only to trade-related transactions. <br><br><b>Applicable containers</b>: investment<br>`,
      isReadOnly: true,
    },
    cusipNumber: {
      type: 'string',
      description: `The CUSIP (Committee on Uniform Securities Identification Procedures) identifies the financial instruments in the United States and Canada.<br><b><br><b>Note</b></b>: The CUSIP number field applies only to trade related transactions.<br><br><b>Applicable containers</b>: investment<br>`,
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
    description: {
      type: 'Description',
      description: `Description details<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>`,
      isReadOnly: true,
    },
    memo: {
      type: 'string',
      description: `Additional notes provided by the user for a particular  transaction through application or API services. <br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>`,
      isReadOnly: true,
    },
    settleDate: {
      type: 'string',
      description: `It is the date on which the transaction is finalized, that is, the date the ownership of the security is transferred to the buyer. The settlement date is usually few days after the transaction date.<br><br><b>Applicable containers</b>: investment<br>`,
      isReadOnly: true,
    },
    type: {
      type: 'string',
      description: `The nature of the transaction, i.e., deposit, refund, payment, etc.<br><b>Note</b>: The transaction type field is available only for the United States, Canada, United Kingdom, and India based provider sites. <br><br><b>Applicable containers</b>: bank,creditCard,investment<br>`,
      isReadOnly: true,
    },
    intermediary: {
      type: 'array',
      contains: {
        type: 'string',
      },
      isReadOnly: true,
    },
    baseType: {
      type: 'Enum',
      isReadOnly: true,
    },
    categorySource: {
      type: 'Enum',
      isReadOnly: true,
    },
    principal: {
      type: 'Money',
      description: `The portion of the principal in the transaction amount. The transaction amount can be the amount due, payment amount, minimum amount, repayment, etc.<br><br><b>Applicable containers</b>: loan<br>`,
      isReadOnly: true,
    },
    lastUpdated: {
      type: 'string',
      isReadOnly: true,
    },
    isDeleted: {
      type: 'boolean',
      description: `Indicates if the transaction is marked as deleted.<b>Applicable containers</b>: All Containers<br><b>Aggregated / Manual</b>: Both <br><b>Endpoints</b>:<br><ul><li>GET dataExtracts/userData</li></ul>`,
      isReadOnly: true,
    },
    interest: {
      type: 'Money',
      description: `The portion of interest in the transaction amount. The transaction amount can be the amount due, payment amount, minimum amount, repayment, etc.<br><br><b>Applicable containers</b>: loan<br>`,
      isReadOnly: true,
    },
    price: {
      type: 'Money',
      description: `The price of the security for the transaction.<br><b>Note</b>: The price field applies only to the trade related transactions. <br><br><b>Applicable containers</b>: investment<br>`,
      isReadOnly: true,
    },
    commission: {
      type: 'Money',
      description: `A commission or brokerage associated with a transaction.<br><br><br><b>Additional Details</b>:The commission only applies to trade-related transactions.<b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>`,
      isReadOnly: true,
    },
    id: {
      type: 'number',
      description: `An unique identifier for the transaction. The combination of the id and account container are unique in the system. <br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>`,
      isReadOnly: true,
      format: 'int64',
    },
    merchantType: {
      type: 'string',
      description: `Indicates the merchantType of the transaction.e.g:-BILLERS,SUBSCRIPTION,OTHERS <br><br><b>Applicable containers</b>: bank,creditCard,investment,loan<br>`,
      isReadOnly: true,
    },
    amount: {
      type: 'Money',
      description: `The amount of the transaction as it appears at the FI site. <br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>`,
      isReadOnly: true,
    },
    checkNumber: {
      type: 'string',
      description: `The checkNumber of the transaction.<br><br><b>Applicable containers</b>: bank<br>`,
      isReadOnly: true,
    },
    isPhysical: {
      type: 'boolean',
      description: `Indicates if the transaction is happened online or in-store. <br><br><b>Applicable containers</b>: bank,creditCard,investment,loan<br>`,
      isReadOnly: true,
    },
    quantity: {
      type: 'number',
      description: `The quantity associated with the transaction.<br><b>Note</b>: The quantity field applies only to trade-related transactions.<br><br><b>Applicable containers</b>: investment<br>`,
      isReadOnly: true,
      format: 'double',
    },
    valoren: {
      type: 'string',
      description: `It is an identification number that is assigned to financial instruments such as stocks and bonds trading in Switzerland.<br><br><b>Applicable containers</b>: investment<br>`,
      isReadOnly: true,
    },
    isManual: {
      type: 'boolean',
      description: `Indicates if the transaction is aggregated from the FI site or the consumer has manually created the transaction using the application or an API. <br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>`,
      isReadOnly: true,
    },
    merchant: {
      type: 'Merchant',
      description: `The name of the merchant associated with the transaction.<br><b>Note</b>: The merchant name field is available only in the United States, Canada, United Kingdom, and India.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>`,
      isReadOnly: true,
    },
    sedol: {
      type: 'string',
      description: `SEDOL stands for Stock Exchange Daily Official List, a list of security identifiers used in the United Kingdom and Ireland for clearing purposes.<br><br><b>Applicable containers</b>: investment<br>`,
      isReadOnly: true,
    },
    transactionDate: {
      type: 'string',
      description: `The date the transaction happens in the account. <br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>`,
      isReadOnly: true,
    },
    categoryType: {
      type: 'Enum',
      isReadOnly: true,
    },
    accountId: {
      type: 'number',
      description: `The account from which the transaction was made. This is basically the primary key of the account resource. <br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>`,
      isReadOnly: true,
      format: 'int64',
    },
    createdDate: {
      type: 'string',
      isReadOnly: true,
    },
    sourceType: {
      type: 'Enum',
      isReadOnly: true,
    },
    CONTAINER: {
      type: 'Enum',
      isReadOnly: true,
    },
    postDate: {
      type: 'string',
      description: `The date on which the transaction is posted to the account.<br><br><b>Applicable containers</b>: bank,creditCard,insurance,loan<br>`,
      isReadOnly: true,
    },
    parentCategoryId: {
      type: 'number',
      description: `The parentCategoryId of the category assigned to the transaction.<br><b>Note</b>: This field will be provided in the response if the transaction is assigned to a user-created category. <br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>`,
      isReadOnly: true,
      format: 'int64',
    },
    subType: {
      type: 'Enum',
      isReadOnly: true,
    },
    category: {
      type: 'string',
      description: `The name of the category assigned to the transaction. This is the category field of the transaction category resource. The supported values are provided by the GET transactions/categories.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>`,
      isReadOnly: true,
    },
    runningBalance: {
      type: 'Money',
      description: `The running balance in an account indicates the balance of the account after every transaction.<br><br><b>Applicable containers</b>: bank,creditCard,investment<br>`,
      isReadOnly: true,
    },
    categoryId: {
      type: 'number',
      description: `The id of the category assigned to the transaction. This is the id field of the transaction category resource. The supported values are provided by the GET transactions/categories.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>`,
      isReadOnly: true,
      format: 'int64',
    },
    holdingDescription: {
      type: 'string',
      description: `For transactions involving securities, this captures the securities description.<br><br><b>Applicable containers</b>: investment<br>`,
      isReadOnly: true,
    },
    isin: {
      type: 'string',
      description: `International Securities Identification Number (ISIN) standard is used worldwide to identify specific securities.<br><br><b>Applicable containers</b>: investment<br>`,
      isReadOnly: true,
    },
    status: {
      type: 'Enum',
      isReadOnly: true,
    },
  },
} as const;
