/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $HoldingAssetClassificationListResponse = {
  properties: {
    assetClassificationList: {
      type: 'array',
      contains: {
        type: 'AssetClassificationList',
      },
      isReadOnly: true,
    },
  },
} as const;
