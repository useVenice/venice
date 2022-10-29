/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Cobrand = {
  properties: {
    cobrandLogin: {
      type: 'string',
      isRequired: true,
      maxLength: 2147483647,
      minLength: 1,
    },
    cobrandPassword: {
      type: 'string',
      isRequired: true,
      maxLength: 2147483647,
      minLength: 1,
    },
    locale: {
      type: 'string',
      description: `The customer's locale that will be considered for the localization functionality.<br><br><b>Endpoints</b>:<ul><li>POST cobrand/login</li></ul>`,
      pattern: '[a-z]{2}_[A-Z]{2}',
    },
  },
} as const
