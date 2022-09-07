/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $UpdateTransaction = {
  properties: {
    categorySource: {
      type: 'Enum',
      isRequired: true,
    },
    container: {
      type: 'Enum',
      isRequired: true,
    },
    isPhysical: {
      type: 'boolean',
    },
    detailCategoryId: {
      type: 'number',
      format: 'int64',
    },
    description: {
      type: 'Description',
    },
    memo: {
      type: 'string',
    },
    merchantType: {
      type: 'Enum',
    },
    categoryId: {
      type: 'number',
      isRequired: true,
      format: 'int64',
    },
  },
} as const;
