/* istanbul ignore file */
/* tslint:disable */
 
export const $Money = {
  properties: {
    amount: {
      type: 'number',
      isRequired: true,
      format: 'double',
    },
    convertedAmount: {
      type: 'number',
      format: 'double',
    },
    currency: {
      type: 'Enum',
    },
    convertedCurrency: {
      type: 'Enum',
    },
  },
} as const
