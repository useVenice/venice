/* istanbul ignore file */
/* tslint:disable */
 
export const $Capability = {
  properties: {
    container: {
      type: 'array',
      contains: {
        type: 'Enum',
      },
      isReadOnly: true,
    },
    name: {
      type: 'string',
      isReadOnly: true,
    },
  },
} as const
