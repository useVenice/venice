/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AssetClassification = {
  properties: {
    allocation: {
      type: 'number',
      description: `The allocation percentage of the holding.<br><br><b>Required Feature Enablement</b>: Asset classification feature<br><br><b>Applicable containers</b>: investment<br>`,
      isReadOnly: true,
      format: 'double',
    },
    classificationType: {
      type: 'string',
      description: `The type of classification to which the investment belongs (assetClass, country, sector, and style).<br><b>Required Feature Enablement</b>: Asset classification feature<br><br><b>Applicable containers</b>: investment<br>`,
      isReadOnly: true,
    },
    classificationValue: {
      type: 'string',
      description: `The value for each classificationType.<br><b>Required Feature Enablement</b>: Asset classification feature<br><br><b>Applicable containers</b>: investment<br>`,
      isReadOnly: true,
    },
  },
} as const;
