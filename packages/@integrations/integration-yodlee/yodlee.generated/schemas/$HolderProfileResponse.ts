/* istanbul ignore file */
/* tslint:disable */
 
export const $HolderProfileResponse = {
  properties: {
    holderProfile: {
      type: 'array',
      contains: {
        type: 'VerificationHolderProfile',
      },
      isReadOnly: true,
    },
  },
} as const
