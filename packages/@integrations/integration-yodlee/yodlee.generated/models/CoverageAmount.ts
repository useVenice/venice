/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Money } from './Money';

export type CoverageAmount = {
  /**
   * The maximum amount that will be paid to an individual or an entity for a covered loss<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: insurance,investment<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>
   */
  readonly cover?: Money;
  /**
   * The type of coverage unit indicates if the coverage is for an individual or a family.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: insurance,investment<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul><b>Applicable Values:</b><br>
   */
  readonly unitType?: 'PER_FAMILY' | 'PER_MEMBER';
  /**
   * The type of coverage provided to an individual or an entity.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: insurance,investment<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul><b>Applicable Values:</b><br>
   */
  readonly type?: 'DEDUCTIBLE' | 'OUT_OF_POCKET' | 'ANNUAL_BENEFIT' | 'MAX_BENEFIT' | 'COVERAGE_AMOUNT' | 'MONTHLY_BENEFIT' | 'OTHER';
  /**
   * The type of coverage limit indicates if the coverage is in-network or out-of-network.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: insurance,investment<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul><b>Applicable Values:</b><br>
   */
  readonly limitType?: 'IN_NETWORK' | 'OUT_NETWORK';
  /**
   * The amount the insurance company paid for the incurred medical expenses.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: insurance,investment<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>
   */
  readonly met?: Money;
};

