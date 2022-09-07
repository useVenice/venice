/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
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
} as const;
