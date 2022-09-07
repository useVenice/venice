/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $InstitutionResponse = {
  properties: {
    institution: {
      type: 'array',
      contains: {
        type: 'Institution',
      },
      isReadOnly: true,
    },
  },
} as const;
