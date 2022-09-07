/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Row = {
  properties: {
    fieldRowChoice: {
      type: 'string',
      description: `Fields that belong to a particular choice are collected together using this field.<br><b>Recommendations</b>: All the field row choices label to be grouped and displayed as options to the customer. On choosing a particular choice field, we recommend displaying the fields relevant to them. First field choice could be selected by default.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>`,
    },
    field: {
      type: 'array',
      contains: {
        type: 'Field',
      },
    },
    form: {
      type: 'string',
      description: `Form denotes the set of the fields that are related. <br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>`,
    },
    id: {
      type: 'string',
      description: `Unique identifier of the row.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>`,
    },
    label: {
      type: 'string',
      description: `The label text displayed for a row in the form.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>`,
    },
  },
} as const;
