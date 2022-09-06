/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FieldOperation } from './FieldOperation';

export type TransactionCategorizationRuleInfo = {
  ruleClause: Array<FieldOperation>;
  source?: 'SYSTEM' | 'USER';
  priority?: number;
  categoryId: number;
};

