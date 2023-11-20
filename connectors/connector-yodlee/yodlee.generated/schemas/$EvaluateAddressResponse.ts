/* istanbul ignore file */
/* tslint:disable */

export const $EvaluateAddressResponse = {
  properties: {
    address: {
      type: 'array',
      contains: {
        type: 'AccountAddress',
      },
      isReadOnly: true,
    },
    isValidAddress: {
      type: 'boolean',
    },
  },
} as const
