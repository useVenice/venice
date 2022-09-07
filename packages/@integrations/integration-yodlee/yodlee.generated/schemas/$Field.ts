/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Field = {
  properties: {
    image: {
      type: 'string',
      description: `Image displayed at the endsite.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li></ul>`,
    },
    prefix: {
      type: 'string',
      description: `The prefix string that has to be displayed before the field value.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>`,
      isReadOnly: true,
    },
    minLength: {
      type: 'number',
      description: `The minimum length of the login form field.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>`,
      isReadOnly: true,
      format: 'int64',
    },
    valueEditable: {
      type: 'string',
      description: `Indicates whether the field is editable or not.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>`,
      isReadOnly: true,
    },
    isOptional: {
      type: 'boolean',
      description: `Indicates if a field is an optional field or a mandatory field.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>`,
      isReadOnly: true,
    },
    suffix: {
      type: 'string',
      description: `The suffix string that has to be displayed next to the field value.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>`,
      isReadOnly: true,
    },
    type: {
      type: 'Enum',
      isReadOnly: true,
    },
    isValueProvided: {
      type: 'boolean',
      description: `Indicates that the answer to the security question already exists in the Yodlee system.Persuading the user to provide the answer to the security question again during the edit-credential flow can be avoided.<br><br><br><b>Endpoints</b>:<ul><li>GET providerAccounts?include=questions</li><li>GET providerAccounts/{providerAccountId}? include=questions</li></ul>`,
      isReadOnly: true,
    },
    name: {
      type: 'string',
      description: `Name of the field.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>`,
      isReadOnly: true,
    },
    id: {
      type: 'string',
      description: `Identifier for the field.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>`,
      maxLength: 2147483647,
      minLength: 1,
    },
    value: {
      type: 'string',
      description: `Value expected from the user for the field. This will be blank and is expected to be filled and sent back when submitting the login or MFA information.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>`,
    },
    maxLength: {
      type: 'number',
      description: `The maximum length of the login form field.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>`,
      isReadOnly: true,
      format: 'int64',
    },
    option: {
      type: 'array',
      contains: {
        type: 'Option',
      },
      isReadOnly: true,
    },
  },
} as const;
