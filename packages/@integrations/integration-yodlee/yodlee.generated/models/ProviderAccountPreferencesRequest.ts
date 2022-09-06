/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ProviderAccountPreferences } from './ProviderAccountPreferences';

export type ProviderAccountPreferencesRequest = {
  /**
   * The preference set for the provider account. <br><br><b>Endpoints</b>:<ul><li>GET providerAccounts?include=preferences</li><li>GET providerAccounts/{providerAccountId}?include=preferences</li></ul>
   */
  preferences?: ProviderAccountPreferences;
};

