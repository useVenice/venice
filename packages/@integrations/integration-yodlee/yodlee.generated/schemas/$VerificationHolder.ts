/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $VerificationHolder = {
  properties: {
    ownership: {
      type: 'string',
      description: `Indicates the ownership of the account`,
      isReadOnly: true,
    },
    name: {
      type: 'Name',
      description: `The name of the account holder`,
      isReadOnly: true,
    },
  },
} as const;
