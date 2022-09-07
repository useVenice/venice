/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Description = {
  properties: {
    security: {
      type: 'string',
      description: `The description will provide the actual name of the security.<br><br><b>Applicable containers</b>: investment<br>`,
      isReadOnly: true,
    },
    original: {
      type: 'string',
      description: `Original transaction description as it appears at the FI site.<br><br><b>Applicable containers</b>: creditCard, insurance, loan<br>`,
      isReadOnly: true,
    },
    simple: {
      type: 'string',
      description: `The transaction description that appears at the FI site may not be self-explanatory, i.e., the source, purpose of the transaction may not be evident. Yodlee attempts to simplify and make the transaction meaningful to the consumer, and this simplified transaction description is provided in the simple description field.Note: The simple description field is available only in the United States, Canada, United Kingdom, and India.<br><br><b>Applicable containers</b>: creditCard, insurance, loan<br>`,
      isReadOnly: true,
    },
    consumer: {
      type: 'string',
      description: `The description of the transaction as defined by the consumer. The consumer can define or provide more details of the transaction in this field.<br><br><b>Applicable containers</b>: creditCard, insurance, loan<br>`,
    },
  },
} as const;
