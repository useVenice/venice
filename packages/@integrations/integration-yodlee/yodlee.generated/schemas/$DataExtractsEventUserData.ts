/* istanbul ignore file */
/* tslint:disable */
 
export const $DataExtractsEventUserData = {
  properties: {
    links: {
      type: 'array',
      contains: {
        type: 'DataExtractsEventLinks',
      },
      isReadOnly: true,
    },
    user: {
      type: 'DataExtractsUser',
      isReadOnly: true,
    },
  },
} as const
