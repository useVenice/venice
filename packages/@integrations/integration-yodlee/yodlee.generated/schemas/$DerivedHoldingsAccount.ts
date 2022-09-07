/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $DerivedHoldingsAccount = {
  properties: {
    id: {
      type: 'number',
      description: `The primary key of the account resource and the unique identifier for the account.<br>Required Feature Enablement: Asset classification feature.<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
      format: 'int64',
    },
    value: {
      type: 'Money',
      description: `The investment accounts cash balance.<br>Required Feature Enablement: Asset classification feature.<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
    },
  },
} as const;
