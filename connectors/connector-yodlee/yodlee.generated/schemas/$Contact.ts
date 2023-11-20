/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Contact = {
  properties: {
    phone: {
      type: 'string',
      description: `Phone number of the merchant<br><br><b>Applicable containers</b>: bank,creditCard,investment,loan<br>`,
    },
    email: {
      type: 'string',
      description: `Email Id of the merchant<br><br><b>Applicable containers</b>: bank,creditCard,investment,loan<br>`,
    },
  },
} as const
