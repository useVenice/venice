/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CoverageAmount } from './CoverageAmount';

export type Coverage = {
  /**
   * The coverage amount-related details.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: insurance,investment<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>
   */
  readonly amount?: Array<CoverageAmount>;
  /**
   * The plan type for an insurance provided to an individual or an entity.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: insurance<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul><b>Applicable Values:</b><br>
   */
  readonly planType?: 'PPO' | 'HMO' | 'UNKNOWN';
  /**
   * The date on which the coverage for the account ends or expires.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: insurance,investment<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>
   */
  readonly endDate?: string;
  /**
   * The type of coverage provided to an individual or an entity.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: insurance,investment<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul><b>Applicable Values:</b><br>
   */
  readonly type?: 'VISION' | 'DENTAL' | 'MEDICAL' | 'HEALTH' | 'DEATH_COVER' | 'TOTAL_PERMANENT_DISABILITY' | 'ACCIDENTAL_DEATH_COVER' | 'INCOME_PROTECTION' | 'DEATH_TOTAL_PERMANENT_DISABILITY' | 'OTHER';
  /**
   * The date on which the coverage for the account starts.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: insurance,investment<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>
   */
  readonly startDate?: string;
};

