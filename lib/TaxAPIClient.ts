import * as request from 'request-promise';
import { TaxAPIClientOptions, AllowedMethods, SalesTaxByZipResponse, VATRatesResponse, VATRatesResponseCountry } from './interfaces';

export default class TaxAPIClient {
  private readonly apiVersion: string = '1';
  private readonly apiBase: string = 'taxapi.io/api/';
  private readonly protocol: string = 'https://';
  public cacheEnabled: boolean;

  constructor(options?: TaxAPIClientOptions) {
    // TaxAPI.io is a free, rate-limited service (by IP). They recommend caching
    // results for one day. Unless otherwise specified, this library will cache
    // results in-memory for one day by default.
    this.cacheEnabled = options && options.cacheEnabled !== undefined
      ? options.cacheEnabled
      : true;
  }

  private buildResourceURI(resourcePath: string): string {
    return `${this.protocol}${this.apiBase}v${this.apiVersion}/${resourcePath}`;
  };

  private async makeRequest(resourcePath: string, method: AllowedMethods, body?: Object): Promise<any> {
    const requestOptions: request.OptionsWithUri = {
      method,
      body,
      uri: this.buildResourceURI(resourcePath),
      json: true,
    };

    return request(requestOptions);
  };

  /**
   * getSalesTaxByZipCode - Returns applicable city, county, and state sales taxes from given ZIP Code™
   *
   * @param {String} zipCode The US ZIP Code™ being used to determine sales tax
   *
   * @returns {Promise<SalesTaxByZipResponse>}
   */
  public async getSalesTaxByZipCode(zipCode: string): Promise<SalesTaxByZipResponse> {
    const response = await this.makeRequest(`salestax/zip/${zipCode}`, AllowedMethods.GET);
    return response.rates;
  };

  /**
   * getVATRates - Gets a listing of current VAT rates for each country in the EU
   *
   * @returns {Promise<VATRatesResponse}
   */
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
}
