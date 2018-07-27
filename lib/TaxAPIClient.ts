import * as request from 'request-promise';
import * as NodeCache from 'node-cache';
import { useNodeCacheAdapter, Cacheable, CacheOptions } from 'type-cacheable';
import {
  TaxAPIClientOptions,
  AllowedMethods,
  SalesTaxByZipResponse,
  VATRatesResponse,
  VATRatesResponseCountry,
  VATNumberValidationResponse,
  RequestStatuses,
} from './interfaces';

export default class TaxAPIClient {
  private readonly apiVersion: string = '1';
  private readonly apiBase: string = 'taxapi.io/api/';
  private readonly protocol: string = 'https://';
  public cacheClient: NodeCache.NodeCache | null = null;

  constructor(options?: TaxAPIClientOptions) {
    // TaxAPI.io is a free, rate-limited service (by IP). They recommend caching
    // results for one day. Unless otherwise specified, this library will cache
    // results in-memory for one day by default.
    const useCache = options && options.cacheEnabled !== undefined
      ? options.cacheEnabled
      : true;

    if (useCache) {
      this.cacheClient = new NodeCache({ stdTTL: 86400 });
      useNodeCacheAdapter(this.cacheClient);
    }
  }

  private buildResourceURI(resourcePath: string): string {
    return `${this.protocol}${this.apiBase}v${this.apiVersion}/${resourcePath}`;
  };

  private async makeRequest(resourcePath: string, method: AllowedMethods, options: any = {}): Promise<any> {
    const requestOptions: request.OptionsWithUri = {
      method,
      qs: options.qs,
      body: options.body,
      uri: this.buildResourceURI(resourcePath),
      json: true,
    };

    const result = await request(requestOptions);

    if (result.status === RequestStatuses.FAILURE) {
      throw new Error(`Error retrieving data from TaxAPI.io: ${result.message}`);
    }

    return result;
  };

  /**
   * getSalesTaxByZipCode - Returns applicable city, county, and state sales taxes from given ZIP Code™
   *
   * @param {String} zipCode The US ZIP Code™ being used to determine sales tax
   *
   * @returns {Promise<SalesTaxByZipResponse>}
   */
  @Cacheable(<CacheOptions> { hashKey: 'salesTaxByZip',  cacheKey: args => args[0], noop: (args, ctx) => !ctx.cacheClient })
  public async getSalesTaxByZipCode(zipCode: string): Promise<SalesTaxByZipResponse> {
    const response = await this.makeRequest(`salestax/zip/${zipCode}`, AllowedMethods.GET);
    return response.rates;
  };

  /**
   * getVATRates - Gets a listing of current VAT rates for each country in the EU
   *
   * @returns {Promise<VATRatesResponse}
   */
  @Cacheable(<CacheOptions> { cacheKey: 'vatRates', noop: (args, ctx) => !ctx.cacheClient })
  public async getVATRates(): Promise<VATRatesResponse> {
    const response = await this.makeRequest('vat/rates', AllowedMethods.GET);
    return response.rates;
  };

  /**
   * getVATRatesByCountryCode - Gets the current VAT rates by EU country code
   *
   * @param {String} euCountryCode Code for country you are seeking VAT rates for (see: https://gist.github.com/henrik/1688572)
   *
   * @returns {Promise<VATRatesResponseCountry>}
   */
  public async getVATRatesByCountryCode(euCountryCode: string): Promise<VATRatesResponseCountry> {
    const vatRates = await this.getVATRates();
    return vatRates[euCountryCode];
  };

  /**
   * validateVATNumber - Returns validation information on a company, given a VAT number
   *
   * @param {String} vatNumber The VAT number of the company being validated
   *
   * @returns {Promise<SalesTaxByZipResponse>}
   */
  @Cacheable(<CacheOptions> { hashKey: 'validatedVATNumbers',  cacheKey: args => args[0], noop: (args, ctx) => Boolean(ctx.cacheClient) })
  public async validateVATNumber(vatNumber: string): Promise<VATNumberValidationResponse> {
    const response = await this.makeRequest('vat', AllowedMethods.GET, { qs: { vat_number: vatNumber } });
    return response;
  }
}
