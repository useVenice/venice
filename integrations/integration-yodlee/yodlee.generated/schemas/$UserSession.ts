/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $UserSession = {
  properties: {
    userSession: {
      type: 'string',
      description: `Session provided for a valid user to access API services upon successful authentication.<br><br><b>Endpoints</b>:<ul><li>POST user/samlLogin</li><li>POST user/register</li></ul>`,
      isReadOnly: true,
    },
  },
} as const
