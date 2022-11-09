/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $PaymentIdentifier = {
  properties: {
    type: {
      type: 'Enum',
      isReadOnly: true,
    },
    value: {
      type: 'string',
      description: `Value of the identifier`,
      isReadOnly: true,
    },
  },
} as const
