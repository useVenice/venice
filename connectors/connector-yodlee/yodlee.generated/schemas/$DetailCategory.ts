/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $DetailCategory = {
  properties: {
    name: {
      type: 'string',
      description: `The name of the detail category<br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br>`,
      isReadOnly: true,
    },
    id: {
      type: 'number',
      description: `The unique identifier of the detail category.<br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br>`,
      isReadOnly: true,
      format: 'int64',
    },
  },
} as const
