/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type AssetClassification = {
  /**
   * The allocation percentage of the holding.<br><br><b>Required Feature Enablement</b>: Asset classification feature<br><br><b>Applicable containers</b>: investment<br>
   */
  readonly allocation?: number;
  /**
   * The type of classification to which the investment belongs (assetClass, country, sector, and style).<br><b>Required Feature Enablement</b>: Asset classification feature<br><br><b>Applicable containers</b>: investment<br>
   */
  readonly classificationType?: string;
  /**
   * The value for each classificationType.<br><b>Required Feature Enablement</b>: Asset classification feature<br><br><b>Applicable containers</b>: investment<br>
   */
  readonly classificationValue?: string;
};

