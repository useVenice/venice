/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Scope = {
  properties: {
    titleBody: {
      type: 'array',
      contains: {
        type: 'string',
      },
      isRequired: true,
    },
    scopeId: {
      type: 'Enum',
      isRequired: true,
    },
    datasetAttributes: {
      type: 'array',
      contains: {
        type: 'string',
      },
    },
    title: {
      type: 'string',
      description: `Title for the Data Cluster.`,
      isRequired: true,
    },
  },
} as const;
