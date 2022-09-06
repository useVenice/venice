/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Option } from './Option';

export type Field = {
  /**
   * Image displayed at the endsite.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li></ul>
   */
  image?: string;
  /**
   * The prefix string that has to be displayed before the field value.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>
   */
  readonly prefix?: string;
  /**
   * The minimum length of the login form field.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>
   */
  readonly minLength?: number;
  /**
   * Indicates whether the field is editable or not.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>
   */
  readonly valueEditable?: string;
  /**
   * Indicates if a field is an optional field or a mandatory field.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>
   */
  readonly isOptional?: boolean;
  /**
   * The suffix string that has to be displayed next to the field value.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>
   */
  readonly suffix?: string;
  /**
   * This indicates the display type of the field. For example, text box, image, etc. <br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul><b>Applicable Values</b><br>
   */
  readonly type?: 'text' | 'password' | 'options' | 'checkbox' | 'radio' | 'image' | 'option';
  /**
   * Indicates that the answer to the security question already exists in the Yodlee system.Persuading the user to provide the answer to the security question again during the edit-credential flow can be avoided.<br><br><br><b>Endpoints</b>:<ul><li>GET providerAccounts?include=questions</li><li>GET providerAccounts/{providerAccountId}? include=questions</li></ul>
   */
  readonly isValueProvided?: boolean;
  /**
   * Name of the field.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>
   */
  readonly name?: string;
  /**
   * Identifier for the field.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>
   */
  id?: string;
  /**
   * Value expected from the user for the field. This will be blank and is expected to be filled and sent back when submitting the login or MFA information.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>
   */
  value?: string;
  /**
   * The maximum length of the login form field.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>
   */
  readonly maxLength?: number;
  /**
   * Provides the different values that are available for the user to choose. This field is applicable for drop-down or radio field types.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>
   */
  readonly option?: Array<Option>;
};

