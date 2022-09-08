/* istanbul ignore file */
/* tslint:disable */
 
export const $VerificationResponse = {
  properties: {
    verification: {
      type: 'array',
      contains: {
        type: 'Verification',
      },
      isReadOnly: true,
    },
  },
} as const
