/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $EnrichUserData = {
  properties: {
    user: {
      type: 'array',
      contains: {
        type: 'EnrichDataUser',
      },
      isRequired: true,
    },
    account: {
      type: 'array',
      contains: {
        type: 'EnrichDataAccount',
      },
      isRequired: true,
    },
    transaction: {
      type: 'array',
      contains: {
        type: 'EnrichDataTransaction',
      },
      isRequired: true,
    },
  },
} as const;
