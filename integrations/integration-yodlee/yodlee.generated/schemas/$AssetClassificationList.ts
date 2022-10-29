/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AssetClassificationList = {
  properties: {
    classificationType: {
      type: 'string',
      description: `The type of classification to which the investment belongs (assetClass, country, sector, and style).<br><b>Required Feature Enablement</b>: Asset classification feature<br><br><b>Applicable containers</b>: investment<br>`,
      isReadOnly: true,
    },
    classificationValue: {
      type: 'array',
      contains: {
        type: 'string',
      },
      isReadOnly: true,
    },
  },
} as const
