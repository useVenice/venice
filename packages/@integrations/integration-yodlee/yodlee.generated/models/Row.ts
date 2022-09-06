/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Field } from './Field';

export type Row = {
  /**
   * Fields that belong to a particular choice are collected together using this field.<br><b>Recommendations</b>: All the field row choices label to be grouped and displayed as options to the customer. On choosing a particular choice field, we recommend displaying the fields relevant to them. First field choice could be selected by default.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>
   */
  fieldRowChoice?: string;
  /**
   * Details of fields that belong to the row.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>
   */
  field?: Array<Field>;
  /**
   * Form denotes the set of the fields that are related. <br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>
   */
  form?: string;
  /**
   * Unique identifier of the row.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>
   */
  id?: string;
  /**
   * The label text displayed for a row in the form.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>
   */
  label?: string;
};

