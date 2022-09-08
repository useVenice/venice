/* istanbul ignore file */
/* tslint:disable */
 
export const $DataExtractsUserDataResponse = {
  properties: {
    userData: {
      type: 'array',
      contains: {
        type: 'DataExtractsUserData',
      },
      isReadOnly: true,
    },
  },
} as const
