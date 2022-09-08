/* istanbul ignore file */
/* tslint:disable */
 
export const $StatementResponse = {
  properties: {
    statement: {
      type: 'array',
      contains: {
        type: 'Statement',
      },
      isReadOnly: true,
    },
  },
} as const
