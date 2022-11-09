/* istanbul ignore file */
/* tslint:disable */

export const $UpdateCategoryRequest = {
  properties: {
    highLevelCategoryName: {
      type: 'string',
    },
    id: {
      type: 'number',
      isRequired: true,
      format: 'int64',
      minimum: 1,
    },
    source: {
      type: 'Enum',
      isRequired: true,
    },
    categoryName: {
      type: 'string',
    },
  },
} as const
