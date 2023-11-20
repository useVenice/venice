/* istanbul ignore file */
/* tslint:disable */

export const $CreatedAccountInfo = {
  properties: {
    accountName: {
      type: 'string',
      isReadOnly: true,
    },
    id: {
      type: 'number',
      isReadOnly: true,
      format: 'int64',
    },
    accountNumber: {
      type: 'string',
      isReadOnly: true,
    },
  },
} as const
