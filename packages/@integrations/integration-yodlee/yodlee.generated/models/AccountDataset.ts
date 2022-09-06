/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type AccountDataset = {
  /**
   * Indicate when the dataset is last updated successfully for the given provider account.<br><br><b>Account Type</b>: Aggregated<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li></ul>
   */
  readonly lastUpdated?: string;
  /**
   * Indicate whether the dataset is eligible for update or not.<br><br><b>Account Type</b>: Aggregated<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li></ul><b>Applicable Values</b><br>
   */
  readonly updateEligibility?: 'ALLOW_UPDATE' | 'ALLOW_UPDATE_WITH_CREDENTIALS' | 'DISALLOW_UPDATE';
  /**
   * The status of last update attempted for the dataset. <br><br><b>Account Type</b>: Aggregated<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li></ul><b>Applicable Values</b><br>
   */
  readonly additionalStatus?: 'LOGIN_IN_PROGRESS' | 'DATA_RETRIEVAL_IN_PROGRESS' | 'ACCT_SUMMARY_RECEIVED' | 'AVAILABLE_DATA_RETRIEVED' | 'PARTIAL_DATA_RETRIEVED' | 'DATA_RETRIEVAL_FAILED' | 'DATA_NOT_AVAILABLE' | 'ACCOUNT_LOCKED' | 'ADDL_AUTHENTICATION_REQUIRED' | 'BETA_SITE_DEV_IN_PROGRESS' | 'CREDENTIALS_UPDATE_NEEDED' | 'INCORRECT_CREDENTIALS' | 'PROPERTY_VALUE_NOT_AVAILABLE' | 'INVALID_ADDL_INFO_PROVIDED' | 'REQUEST_TIME_OUT' | 'SITE_BLOCKING_ERROR' | 'UNEXPECTED_SITE_ERROR' | 'SITE_NOT_SUPPORTED' | 'SITE_UNAVAILABLE' | 'TECH_ERROR' | 'USER_ACTION_NEEDED_AT_SITE' | 'SITE_SESSION_INVALIDATED' | 'NEW_AUTHENTICATION_REQUIRED' | 'DATASET_NOT_SUPPORTED' | 'ENROLLMENT_REQUIRED_FOR_DATASET' | 'CONSENT_REQUIRED' | 'CONSENT_EXPIRED' | 'CONSENT_REVOKED' | 'INCORRECT_OAUTH_TOKEN' | 'MIGRATION_IN_PROGRESS';
  /**
   * Indicates when the next attempt to update the dataset is scheduled.<br><br><b>Account Type</b>: Aggregated<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li></ul>
   */
  readonly nextUpdateScheduled?: string;
  /**
   * The name of the dataset requested from the provider site<br><br><b>Account Type</b>: Manual<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li><li>GET providers</li></ul><b>Applicable Values</b><br>
   */
  name?: 'BASIC_AGG_DATA' | 'ADVANCE_AGG_DATA' | 'ACCT_PROFILE' | 'DOCUMENT';
  /**
   * Indicate when the last attempt was performed to update the dataset for the given provider account<br><br><b>Account Type</b>: Aggregated<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li></ul>
   */
  readonly lastUpdateAttempt?: string;
};

