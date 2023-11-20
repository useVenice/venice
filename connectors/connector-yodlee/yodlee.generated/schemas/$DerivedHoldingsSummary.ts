/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $DerivedHoldingsSummary = {
  properties: {
    holding: {
      type: 'array',
      contains: {
        type: 'DerivedHolding',
      },
      isReadOnly: true,
    },
    classificationType: {
      type: 'string',
      description: `The classification type of the security. The supported asset classification type and the values are provided in the /holdings/assetClassificationList.<br><b>Required Feature Enablement</b>: Asset classification feature.<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
    },
    classificationValue: {
      type: 'string',
      description: `The classification value that corresponds to the classification type of the holding. The supported asset classification type and the values are provided in the /holdings/assetClassificationList.<br><b>Required Feature Enablement</b>: Asset classification feature.<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
    },
    value: {
      type: 'Money',
      description: `Summary value of the securities.<br><b>Required Feature Enablement</b>: Asset classification feature.<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
    },
    account: {
      type: 'array',
      contains: {
        type: 'DerivedHoldingsAccount',
      },
      isReadOnly: true,
    },
  },
} as const
