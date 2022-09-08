/* istanbul ignore file */
/* tslint:disable */
 
export const $UserRegistration = {
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
