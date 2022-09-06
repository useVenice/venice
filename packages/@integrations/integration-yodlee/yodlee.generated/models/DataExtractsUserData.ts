/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DataExtractsAccount } from './DataExtractsAccount';
import type { DataExtractsHolding } from './DataExtractsHolding';
import type { DataExtractsProviderAccount } from './DataExtractsProviderAccount';
import type { DataExtractsTransaction } from './DataExtractsTransaction';
import type { DataExtractsUser } from './DataExtractsUser';

export type DataExtractsUserData = {
  readonly holding?: Array<DataExtractsHolding>;
  readonly totalTransactionsCount?: number;
  readonly user?: DataExtractsUser;
  readonly account?: Array<DataExtractsAccount>;
  readonly transaction?: Array<DataExtractsTransaction>;
  readonly providerAccount?: Array<DataExtractsProviderAccount>;
};

