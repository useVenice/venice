/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Identifier } from './Identifier';
import type { Name } from './Name';

export type AccountHolder = {
  /**
   * Identifiers of the account holder.<br><br><b>Aggregated / Manual</b>: Aggregated <br><b>Applicable containers</b>: bank<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>
   */
  readonly identifier?: Array<Identifier>;
  /**
   * Identifiers of the account holder.<br><br><b>Aggregated / Manual</b>: Aggregated <br><b>Applicable containers</b>: bank<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>
   */
  readonly gender?: string;
  /**
   * Indicates the ownership of the account.<br><br><b>Aggregated / Manual</b>: Aggregated <br><b>Applicable containers</b>: bank<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul><b>Applicable Values</b><br>
   */
  readonly ownership?: 'PRIMARY' | 'SECONDARY' | 'CUSTODIAN' | 'OTHERS' | 'POWER_OF_ATTORNEY' | 'TRUSTEE' | 'JOINT_OWNER' | 'BENEFICIARY' | 'AAS' | 'BUSINESS' | 'DBA' | 'TRUST';
  /**
   * Name of the account holder.<br><br><b>Aggregated / Manual</b>: Aggregated <br><b>Applicable containers</b>: bank<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>
   */
  readonly name?: Name;
};

