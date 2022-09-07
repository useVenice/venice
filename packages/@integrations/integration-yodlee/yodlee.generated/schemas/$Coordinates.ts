/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Coordinates = {
  properties: {
    latitude: {
      type: 'number',
      description: `Latitude of the merchant<br><br><b>Applicable containers</b>: bank,creditCard,loan<br>`,
      format: 'double',
    },
    longitude: {
      type: 'number',
      description: `Longitude of the merchant<br><br><b>Applicable containers</b>: bank,creditCard,loan<br>`,
      format: 'double',
    },
  },
} as const;
