/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ApiKeyOutput } from './ApiKeyOutput';

export type ApiKeyResponse = {
  /**
   * ApiKey customer details.<br><br><b>Endpoints</b>:<ul><li>GET /auth/apiKey</li><li>POST /auth/apiKey</li></ul>
   */
  apiKey?: Array<ApiKeyOutput>;
};

