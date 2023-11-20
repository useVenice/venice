/* istanbul ignore file */
/* tslint:disable */

export const $EnrichDataUser = {
  properties: {
    preferences: {
      type: 'UserRequestPreferences',
    },
    address: {
      type: 'UserAddress',
    },
    loginName: {
      type: 'string',
      isRequired: true,
      maxLength: 150,
      minLength: 3,
      pattern: '[^\\s]+',
    },
    name: {
      type: 'Name',
    },
    email: {
      type: 'string',
      isRequired: true,
      maxLength: 2147483647,
      minLength: 1,
    },
    segmentName: {
      type: 'string',
    },
  },
} as const
