/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type {AccountAddress} from './AccountAddress'
import type {Contact} from './Contact'
import type {Coordinates} from './Coordinates'

export type Merchant = {
  /**
   * The website of the merchant.<br><br><b>Applicable containers</b>: bank,creditCard,investment,loan<br>
   */
  readonly website?: string
  /**
   * The address of the merchant associated with the transaction is populated in the merchant address field.<br><b>Note</b>: The merchant address field is not available by default and customers will have to specifically request the merchant's address (that includes city, state, and ZIP of the merchant). The merchant address field is available only for merchants in the United States.<br><br><b>Applicable containers</b>: bank,creditCard<br>
   */
  readonly address?: AccountAddress
  /**
   * The merchant contact information like phone and email.<br><br><b>Applicable containers</b>: bank,creditCard,investment,loan<br>
   */
  contact?: Contact
  /**
   * The business categories of the merchant.<br><br><b>Applicable containers</b>: bank,creditCard<br><b>Applicable Values</b><br>
   */
  readonly categoryLabel?: Array<string>
  /**
   * The merchant geolocation coordinates like latitude and longitude.<br><br><b>Applicable containers</b>: bank,creditCard,loan<br>
   */
  coordinates?: Coordinates
  /**
   * The name of the merchant.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
   */
  readonly name?: string
  /**
   * Identifier of the merchant.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
   */
  readonly id?: string
  /**
   * The source through which merchant information is retrieved.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br><b>Applicable Values</b><br>
   */
  readonly source?: 'YODLEE' | 'FACTUAL'
  /**
   * The logoURL of the merchant.<br><br><b>Applicable containers</b>: bank,creditCard,investment,loan<br>
   */
  readonly logoURL?: string
}
