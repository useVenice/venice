/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AccountResponse = {
  properties: {
    account: {
      type: 'array',
      contains: {
        type: 'Account',
      },
      isReadOnly: true,
    },
  },
} as const;
