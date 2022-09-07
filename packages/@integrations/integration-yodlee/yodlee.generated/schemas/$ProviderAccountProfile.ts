/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ProviderAccountProfile = {
  properties: {
    profile: {
      type: 'array',
      contains: {
        type: 'Profile',
      },
      isReadOnly: true,
    },
    id: {
      type: 'number',
      description: `Unique identifier for profile<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/profile</li></ul>`,
      isReadOnly: true,
      format: 'int64',
    },
  },
} as const;
