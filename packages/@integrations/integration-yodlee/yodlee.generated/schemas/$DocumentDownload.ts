/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $DocumentDownload = {
  properties: {
    docContent: {
      type: 'string',
      description: `Contents of the document in Base64 format.<br><br><b>Applicable containers</b>: bank, investment, creditCard, loan, insurance<br>`,
      isReadOnly: true,
    },
    id: {
      type: 'string',
      description: `The document's primary key and unique identifier.<br><br><b>Applicable containers</b>: bank, investment, creditCard, loan, insurance<br>`,
      isReadOnly: true,
    },
  },
} as const;
