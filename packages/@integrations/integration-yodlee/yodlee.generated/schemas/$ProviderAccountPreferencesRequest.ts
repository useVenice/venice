/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ProviderAccountPreferencesRequest = {
  properties: {
    preferences: {
      type: 'ProviderAccountPreferences',
      description: `The preference set for the provider account. <br><br><b>Endpoints</b>:<ul><li>GET providerAccounts?include=preferences</li><li>GET providerAccounts/{providerAccountId}?include=preferences</li></ul>`,
    },
  },
} as const;
