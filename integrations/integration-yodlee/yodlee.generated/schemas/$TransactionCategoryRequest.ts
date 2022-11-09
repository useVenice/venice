/* istanbul ignore file */
/* tslint:disable */

export const $TransactionCategoryRequest = {
  properties: {
    parentCategoryId: {
      type: 'number',
      isRequired: true,
      format: 'int32',
      minimum: 1,
    },
    source: {
      type: 'string',
      isReadOnly: true,
    },
    categoryName: {
      type: 'string',
      maxLength: 50,
      minLength: 1,
    },
  },
} as const
