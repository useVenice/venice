/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Scope = {
  /**
   * Title body that explains the purpose of the scope.
   */
  titleBody: Array<string>;
  /**
   * Unique Dataset Cluster name for the consent group like <br/> ACCOUNT_DETAILS<br/> STATEMENT_DETAILS<br/> CONTACT_DETAILS<br/> TRANSACTION_DETAILS
   */
  scopeId: 'ACCOUNT_DETAILS' | 'TRANSACTION_DETAILS' | 'STATEMENT_DETAILS' | 'CONTACT_DETAILS';
  /**
   * Permissions that are associated with the Consent group like<br/> BASIC_AGG_DATA.BASIC_ACCOUNT_INFO<br/> BASIC_AGG_DATA.ACCOUNT_DETAILS<br/> BASIC_AGG_DATA.STATEMENTS<br/> BASIC_AGG_DATA.TRANSACTIONS<br/> ACCT_PROFILE.HOLDER_NAME<br/> ACCT_PROFILE.FULL_ACCT_NUMBER<br/> ACCT_PROFILE.BANK_TRANSFER_CODE<br/> ACCT_PROFILE.HOLDER_DETAILS
   */
  datasetAttributes?: Array<string>;
  /**
   * Title for the Data Cluster.
   */
  title: string;
};

