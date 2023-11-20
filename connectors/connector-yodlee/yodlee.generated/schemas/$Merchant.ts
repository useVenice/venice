/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Merchant = {
  properties: {
    website: {
      type: 'string',
      description: `The website of the merchant.<br><br><b>Applicable containers</b>: bank,creditCard,investment,loan<br>`,
      isReadOnly: true,
    },
    address: {
      type: 'AccountAddress',
      description: `The address of the merchant associated with the transaction is populated in the merchant address field.<br><b>Note</b>: The merchant address field is not available by default and customers will have to specifically request the merchant's address (that includes city, state, and ZIP of the merchant). The merchant address field is available only for merchants in the United States.<br><br><b>Applicable containers</b>: bank,creditCard<br>`,
      isReadOnly: true,
    },
    contact: {
      type: 'Contact',
      description: `The merchant contact information like phone and email.<br><br><b>Applicable containers</b>: bank,creditCard,investment,loan<br>`,
    },
    categoryLabel: {
      type: 'array',
      contains: {
        type: 'string',
      },
      isReadOnly: true,
    },
    coordinates: {
      type: 'Coordinates',
      description: `The merchant geolocation coordinates like latitude and longitude.<br><br><b>Applicable containers</b>: bank,creditCard,loan<br>`,
    },
    name: {
      type: 'string',
      description: `The name of the merchant.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>`,
      isReadOnly: true,
    },
    id: {
      type: 'string',
      description: `Identifier of the merchant.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>`,
      isReadOnly: true,
    },
    source: {
      type: 'Enum',
      isReadOnly: true,
    },
    logoURL: {
      type: 'string',
      description: `The logoURL of the merchant.<br><br><b>Applicable containers</b>: bank,creditCard,investment,loan<br>`,
      isReadOnly: true,
    },
  },
} as const
