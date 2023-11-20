/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $CobrandLoginResponse = {
  properties: {
    session: {
      type: 'CobrandSession',
    },
    cobrandId: {
      type: 'number',
      description: `Unique identifier of the cobrand (customer) in the system.<br><br><b>Endpoints</b>:<ul><li>POST cobrand/login</li></ul>`,
      isReadOnly: true,
      format: 'int64',
    },
    applicationId: {
      type: 'string',
      description: `The application identifier.<br><br><b>Endpoints</b>:<ul><li>POST cobrand/login</li></ul>`,
      isReadOnly: true,
    },
    locale: {
      type: 'string',
      description: `The customer's locale that will be considered for the localization functionality.<br><br><b>Endpoints</b>:<ul><li>POST cobrand/login</li></ul>`,
      isReadOnly: true,
    },
  },
} as const
