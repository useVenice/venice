/* istanbul ignore file */

/* tslint:disable */
import {AxiosHttpRequest} from './core/AxiosHttpRequest'
import type {BaseHttpRequest} from './core/BaseHttpRequest'
import type {OpenAPIConfig} from './core/OpenAPI'
import {AccountsService} from './services/AccountsService'
import {AuthService} from './services/AuthService'
import {CobrandService} from './services/CobrandService'
import {ConfigsService} from './services/ConfigsService'
import {ConsentsService} from './services/ConsentsService'
import {DataExtractsService} from './services/DataExtractsService'
import {DerivedService} from './services/DerivedService'
import {DocumentsService} from './services/DocumentsService'
import {EnrichDataService} from './services/EnrichDataService'
import {HoldingsService} from './services/HoldingsService'
import {InstitutionsService} from './services/InstitutionsService'
import {ProviderAccountsService} from './services/ProviderAccountsService'
import {ProvidersService} from './services/ProvidersService'
import {StatementsService} from './services/StatementsService'
import {TransactionsService} from './services/TransactionsService'
import {UserService} from './services/UserService'
import {VerificationService} from './services/VerificationService'
import {VerifyAccountService} from './services/VerifyAccountService'

type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest

export class YodleeAPI {
  public readonly accounts: AccountsService
  public readonly auth: AuthService
  public readonly cobrand: CobrandService
  public readonly configs: ConfigsService
  public readonly consents: ConsentsService
  public readonly dataExtracts: DataExtractsService
  public readonly derived: DerivedService
  public readonly documents: DocumentsService
  public readonly enrichData: EnrichDataService
  public readonly holdings: HoldingsService
  public readonly institutions: InstitutionsService
  public readonly providerAccounts: ProviderAccountsService
  public readonly providers: ProvidersService
  public readonly statements: StatementsService
  public readonly transactions: TransactionsService
  public readonly user: UserService
  public readonly verification: VerificationService
  public readonly verifyAccount: VerifyAccountService

  public readonly request: BaseHttpRequest

  constructor(
    config?: Partial<OpenAPIConfig>,
    HttpRequest: HttpRequestConstructor = AxiosHttpRequest,
  ) {
    this.request = new HttpRequest({
      BASE: config?.BASE ?? '',
      VERSION: config?.VERSION ?? '1.1.0',
      WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
      CREDENTIALS: config?.CREDENTIALS ?? 'include',
      TOKEN: config?.TOKEN,
      USERNAME: config?.USERNAME,
      PASSWORD: config?.PASSWORD,
      HEADERS: config?.HEADERS,
      ENCODE_PATH: config?.ENCODE_PATH,
    })

    this.accounts = new AccountsService(this.request)
    this.auth = new AuthService(this.request)
    this.cobrand = new CobrandService(this.request)
    this.configs = new ConfigsService(this.request)
    this.consents = new ConsentsService(this.request)
    this.dataExtracts = new DataExtractsService(this.request)
    this.derived = new DerivedService(this.request)
    this.documents = new DocumentsService(this.request)
    this.enrichData = new EnrichDataService(this.request)
    this.holdings = new HoldingsService(this.request)
    this.institutions = new InstitutionsService(this.request)
    this.providerAccounts = new ProviderAccountsService(this.request)
    this.providers = new ProvidersService(this.request)
    this.statements = new StatementsService(this.request)
    this.transactions = new TransactionsService(this.request)
    this.user = new UserService(this.request)
    this.verification = new VerificationService(this.request)
    this.verifyAccount = new VerifyAccountService(this.request)
  }
}
