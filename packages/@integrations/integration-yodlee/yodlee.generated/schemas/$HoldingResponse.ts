/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $HoldingResponse = {
  properties: {
    holding: {
      type: 'array',
      contains: {
        type: 'Holding',
      },
      isReadOnly: true,
    },
  },
} as const;
