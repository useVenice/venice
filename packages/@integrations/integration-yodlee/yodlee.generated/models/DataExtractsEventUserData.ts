/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DataExtractsEventLinks } from './DataExtractsEventLinks';
import type { DataExtractsUser } from './DataExtractsUser';

export type DataExtractsEventUserData = {
  readonly links?: Array<DataExtractsEventLinks>;
  readonly user?: DataExtractsUser;
};

