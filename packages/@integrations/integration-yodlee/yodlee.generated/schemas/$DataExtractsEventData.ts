/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $DataExtractsEventData = {
  properties: {
    fromDate: {
      type: 'string',
      isReadOnly: true,
    },
    userData: {
      type: 'array',
      contains: {
        type: 'DataExtractsEventUserData',
      },
      isReadOnly: true,
    },
    userCount: {
      type: 'number',
      isReadOnly: true,
      format: 'int32',
    },
    toDate: {
      type: 'string',
      isReadOnly: true,
    },
  },
} as const;
