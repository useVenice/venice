/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AbstractAddress } from './AbstractAddress';
import type { Email } from './Email';
import type { PhoneNumber } from './PhoneNumber';
import type { VerificationHolder } from './VerificationHolder';

export type VerificationHolderProfile = {
  /**
   * The primary key of the account resource and the unique identifier for the account
   */
  readonly accountId?: number;
  /**
   * The account holder's address available at the profile and account levels
   */
  readonly address?: Array<AbstractAddress>;
  /**
   * The account holder's phone number available at the profile and account levels
   */
  readonly phoneNumber?: Array<PhoneNumber>;
  /**
   * The primary key of the provider account resource
   */
  readonly providerAccountId?: number;
  /**
   * The holder entity is account-specific and captures the ownership status and the name details of the user
   */
  readonly holder?: Array<VerificationHolder>;
  /**
   * The account holder's email ID available at the profile and account levels
   */
  readonly email?: Array<Email>;
};

