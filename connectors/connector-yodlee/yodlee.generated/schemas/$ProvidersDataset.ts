/* istanbul ignore file */
/* tslint:disable */

export const $ProvidersDataset = {
  properties: {
    name: {
      type: 'Enum',
    },
    attribute: {
      type: 'array',
      contains: {
        type: 'Attribute',
      },
    },
  },
} as const
