/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $DocumentDownloadResponse = {
  properties: {
    document: {
      type: 'array',
      contains: {
        type: 'DocumentDownload',
      },
      isReadOnly: true,
    },
  },
} as const;
