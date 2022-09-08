/* istanbul ignore file */
/* tslint:disable */
 
export const $HoldingTypeListResponse = {
  properties: {
    holdingType: {
      type: 'array',
      contains: {
        type: 'Enum',
      },
      isReadOnly: true,
    },
  },
} as const
