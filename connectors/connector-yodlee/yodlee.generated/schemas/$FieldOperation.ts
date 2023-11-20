/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $FieldOperation = {
  properties: {
    field: {
      type: 'Enum',
    },
    operation: {
      type: 'Enum',
    },
    value: {
      description: `The value would be the amount value in case of amount based rule clause or the string value in case of description based rule clause.<br><br><b>Applicable containers</b>: bank, creditCard, investment, insurance, loan<br><b>Applicable Values</b>:<ul><li>field is <b>description</b> -> value should be <b>min of 3 and max of 50 characters</b></li><li>field is <b>amount</b> -> value should be <b> min value of 0 and a max value of 99999999999.99</b></li></ul>`,
      properties: {},
    },
  },
} as const
