/* istanbul ignore file */
/* tslint:disable */

export const $AssociatedAccountsResponse = {
  properties: {
    account: {
      type: 'array',
      contains: {
        type: 'AssociatedAccount',
      },
      isReadOnly: true,
    },
  },
} as const
