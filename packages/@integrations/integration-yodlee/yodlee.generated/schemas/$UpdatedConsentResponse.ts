/* istanbul ignore file */
/* tslint:disable */
 
export const $UpdatedConsentResponse = {
  properties: {
    consent: {
      type: 'array',
      contains: {
        type: 'UpdateConsent',
      },
      isReadOnly: true,
    },
  },
} as const
