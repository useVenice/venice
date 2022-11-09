/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Renewal = {
  properties: {
    defaultRenewalDuration: {
      type: 'number',
      description: `Shows the duration in days of consent renewal`,
      isRequired: true,
      format: 'int64',
    },
    isReauthorizationRequired: {
      type: 'boolean',
      description: `Shows if the consent renewal need reauthorization`,
      isRequired: true,
    },
  },
} as const
