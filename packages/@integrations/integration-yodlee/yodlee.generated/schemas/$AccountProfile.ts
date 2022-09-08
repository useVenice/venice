/* istanbul ignore file */
/* tslint:disable */
 
export const $AccountProfile = {
  properties: {
    identifier: {
      type: 'array',
      contains: {
        type: 'Identifier',
      },
      isReadOnly: true,
    },
    address: {
      type: 'array',
      contains: {
        type: 'AccountAddress',
      },
      isReadOnly: true,
    },
    phoneNumber: {
      type: 'array',
      contains: {
        type: 'PhoneNumber',
      },
      isReadOnly: true,
    },
    email: {
      type: 'array',
      contains: {
        type: 'Email',
      },
      isReadOnly: true,
    },
  },
} as const
