/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Name } from './Name';
import type { UserAddress } from './UserAddress';
import type { UserRequestPreferences } from './UserRequestPreferences';

export type UpdateUserRegistration = {
  preferences?: UserRequestPreferences;
  address?: UserAddress;
  name?: Name;
  email?: string;
  segmentName?: string;
};

