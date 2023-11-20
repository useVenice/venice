/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $LoginForm = {
  properties: {
    mfaInfoTitle: {
      type: 'string',
      description: `The title for the MFA information demanded from the user.This is the title displayed in the provider site.This field is applicable for MFA form types only. <br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li></ul>`,
      isReadOnly: true,
    },
    help: {
      type: 'string',
      description: `The help that can be displayed to the customer in the login form.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>`,
      isReadOnly: true,
    },
    forgetPasswordURL: {
      type: 'string',
      description: `The forget password URL of the provider site.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>`,
    },
    formType: {
      type: 'Enum',
    },
    mfaInfoText: {
      type: 'string',
      description: `The text displayed in the provider site while requesting the user's MFA information. This field is applicable for MFA form types only. <br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li></ul>`,
      isReadOnly: true,
    },
    loginHelp: {
      type: 'string',
      description: `The help that can be displayed to the customer in the login form.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>`,
      isReadOnly: true,
    },
    mfaTimeout: {
      type: 'number',
      description: `The amount of time before which the user is expected to provide MFA information. This field is applicable for MFA form types only. This would be an useful information that could be displayed to the users. <br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>`,
      isReadOnly: true,
      format: 'int64',
    },
    id: {
      type: 'number',
      description: `The identifier of the login form.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>`,
      format: 'int64',
    },
    row: {
      type: 'array',
      contains: {
        type: 'Row',
      },
    },
  },
} as const
