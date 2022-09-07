/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $VerifiedAccountResponse = {
  properties: {
    requestId: {
      type: 'string',
      description: `The unique identifier for the verification request that returns contextual data`,
      isReadOnly: true,
    },
    requestDate: {
      type: 'string',
      description: `The date of the verification request`,
      isReadOnly: true,
    },
    state: {
      type: 'Enum',
      isReadOnly: true,
    },
    verifiedAccount: {
      type: 'array',
      contains: {
        type: 'VerifiedAccounts',
      },
      isReadOnly: true,
    },
    failedReason: {
      type: 'Enum',
      isReadOnly: true,
    },
  },
} as const;
