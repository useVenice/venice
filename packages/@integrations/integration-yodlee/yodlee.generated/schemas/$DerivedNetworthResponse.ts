/* istanbul ignore file */
/* tslint:disable */
 
export const $DerivedNetworthResponse = {
  properties: {
    networth: {
      type: 'array',
      contains: {
        type: 'DerivedNetworth',
      },
      isReadOnly: true,
    },
  },
} as const
