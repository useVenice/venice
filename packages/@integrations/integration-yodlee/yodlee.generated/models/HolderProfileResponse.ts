/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { VerificationHolderProfile } from './VerificationHolderProfile';

export type HolderProfileResponse = {
  /**
   * The holder profile entity encapsulates all the user's details, such as the corresponding accounts and the userâ€™s profile data under it
   */
  readonly holderProfile?: Array<VerificationHolderProfile>;
};

