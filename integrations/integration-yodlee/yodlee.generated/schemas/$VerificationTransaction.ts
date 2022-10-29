/* istanbul ignore file */
/* tslint:disable */

export const $VerificationTransaction = {
  properties: {
    amount: {
      type: 'Money',
      isRequired: true,
    },
    baseType: {
      type: 'Enum',
      isRequired: true,
    },
  },
} as const
