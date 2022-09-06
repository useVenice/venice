/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Name } from './Name';

export type VerificationHolder = {
  /**
   * Indicates the ownership of the account
   */
  readonly ownership?: string;
  /**
   * The name of the account holder
   */
  readonly name?: Name;
};

