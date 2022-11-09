/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $User = {
  properties: {
    preferences: {
      type: 'UserResponsePreferences',
      description: `Preferences of the user to be respected in the data provided through various API services.<br><br><b>Endpoints</b>:<ul><li>POST user/samlLogin</li><li>POST user/register</li><li>GET user</li></ul>`,
      isReadOnly: true,
    },
    session: {
      type: 'UserSession',
      description: `Session token of the user using which other services are invoked in the system.<br><br><b>Endpoints</b>:<ul><li>POST user/samlLogin</li><li>POST user/register</li></ul>`,
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
  },
} as const
