/* istanbul ignore file */
/* tslint:disable */
 
export const $SecurityHolding = {
  properties: {
    security: {
      type: 'Security',
      isReadOnly: true,
    },
    id: {
      type: 'string',
      isReadOnly: true,
    },
  },
} as const
