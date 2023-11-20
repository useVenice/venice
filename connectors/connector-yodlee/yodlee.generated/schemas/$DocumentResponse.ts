/* istanbul ignore file */
/* tslint:disable */

export const $DocumentResponse = {
  properties: {
    document: {
      type: 'array',
      contains: {
        type: 'Document',
      },
      isReadOnly: true,
    },
  },
} as const
