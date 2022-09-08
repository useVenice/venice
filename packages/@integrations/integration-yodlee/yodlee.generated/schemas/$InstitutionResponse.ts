/* istanbul ignore file */
/* tslint:disable */
 
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
} as const
