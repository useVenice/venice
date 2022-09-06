/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Option = {
  /**
   * The text that is displayed to the user for that option in the provider site.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>
   */
  displayText?: string;
  /**
   * The value that is associated with the option.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>
   */
  optionValue?: string;
  /**
   * The option that is selected by default in the provider site.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>
   */
  isSelected?: boolean;
};

