/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $UserDetail = {
  properties: {
    preferences: {
      type: 'UserResponsePreferences',
      description: `Preferences of the user to be respected in the data provided through various API services.<br><br><b>Endpoints</b>:<ul><li>POST user/samlLogin</li><li>POST user/register</li><li>GET user</li></ul>`,
      isReadOnly: true,
    },
    address: {
      type: 'UserAddress',
      description: `The address of the user.<br><br><b>Endpoints</b>:<ul><li>GET user</li></ul>`,
      isReadOnly: true,
    },
    loginName: {
      type: 'string',
      description: `The login name of the user used for authentication.<br><br><b>Endpoints</b>:<ul><li>POST user/register</li><li>GET user</li></ul>`,
      isReadOnly: true,
    },
    name: {
      type: 'Name',
      description: `First, middle and last names of the user.<br><br><b>Endpoints</b>:<ul><li>POST user/samlLogin</li><li>POST user/register</li><li>GET user</li></ul>`,
      isReadOnly: true,
    },
    id: {
      type: 'number',
      description: `The unique identifier of a consumer/user in Yodlee system for whom the API services would be accessed for.<br><br><b>Endpoints</b>:<ul><li>POST user/samlLogin</li><li>POST user/register</li><li>GET user</li></ul>`,
      isReadOnly: true,
      format: 'int64',
    },
    roleType: {
      type: 'Enum',
    },
    email: {
      type: 'string',
      description: `The email address of the user.<br><br><b>Endpoints</b>:<ul><li>GET user</li></ul>`,
      isReadOnly: true,
    },
    segmentName: {
      type: 'string',
    },
  },
} as const;
