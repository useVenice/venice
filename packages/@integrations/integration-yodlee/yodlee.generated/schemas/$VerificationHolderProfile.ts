/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $VerificationHolderProfile = {
  properties: {
    accountId: {
      type: 'number',
      description: `The primary key of the account resource and the unique identifier for the account`,
      isReadOnly: true,
      format: 'int64',
    },
    address: {
      type: 'array',
      contains: {
        type: 'AbstractAddress',
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
    providerAccountId: {
      type: 'number',
      description: `The primary key of the provider account resource`,
      isReadOnly: true,
      format: 'int64',
    },
    holder: {
      type: 'array',
      contains: {
        type: 'VerificationHolder',
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
} as const;
