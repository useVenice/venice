/* istanbul ignore file */
/* tslint:disable */

export const $VerificationAccount = {
  properties: {
    accountName: {
      type: 'string',
    },
    accountType: {
      type: 'Enum',
      isRequired: true,
    },
    accountNumber: {
      type: 'string',
      isRequired: true,
      maxLength: 17,
      minLength: 3,
    },
    bankTransferCode: {
      type: 'VerificationBankTransferCode',
      isRequired: true,
    },
  },
} as const
