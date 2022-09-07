/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $VerificationStatusResponse = {
  properties: {
    verification: {
      type: 'array',
      contains: {
        type: 'VerificationStatus',
      },
      isReadOnly: true,
    },
  },
} as const;
