/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Verification = {
  properties: {
    accountId: {
      type: 'number',
      description: `Unique identifier for the account.<br><br><b>Endpoints</b>:<ul><li>POST verification</li><li>GET verification</li><li>PUT verification</li></ul>`,
      format: 'int64',
    },
    reason: {
      type: 'Enum',
      isReadOnly: true,
    },
    verificationStatus: {
      type: 'Enum',
      isReadOnly: true,
    },
    providerAccountId: {
      type: 'number',
      description: `Unique identifier for the provider account.<br><br><b>Endpoints</b>:<ul><li>POST verification</li><li>GET verification</li><li>PUT verification</li></ul>`,
      format: 'int64',
    },
    verificationType: {
      type: 'Enum',
    },
    account: {
      type: 'VerificationAccount',
    },
    verificationDate: {
      type: 'string',
      description: `The date of the account verification.<br><br><b>Endpoints</b>:<ul><li>POST verification</li><li>GET verification</li><li>PUT verification</li></ul>`,
      isReadOnly: true,
    },
    verificationId: {
      type: 'number',
      description: `Unique identifier for the verification request.<br><br><b>Endpoints</b>:<ul><li>POST verification</li><li>GET verification</li><li>PUT verification</li></ul>`,
      isReadOnly: true,
      format: 'int64',
    },
  },
} as const
