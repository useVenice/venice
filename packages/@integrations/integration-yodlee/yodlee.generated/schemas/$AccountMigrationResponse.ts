/* istanbul ignore file */
/* tslint:disable */
 
export const $AccountMigrationResponse = {
  properties: {
    providerId: {
      type: 'number',
      isReadOnly: true,
      format: 'int64',
    },
    providerAccountId: {
      type: 'number',
      isReadOnly: true,
      format: 'int64',
    },
  },
} as const
