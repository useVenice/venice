/* istanbul ignore file */
/* tslint:disable */

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
} as const
