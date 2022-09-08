/* istanbul ignore file */
/* tslint:disable */
 
export const $UpdateUserRegistration = {
  properties: {
    preferences: {
      type: 'UserRequestPreferences',
    },
    address: {
      type: 'UserAddress',
    },
    name: {
      type: 'Name',
    },
    email: {
      type: 'string',
    },
    segmentName: {
      type: 'string',
    },
  },
} as const
