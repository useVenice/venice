/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
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
} as const;
