import TaxAPIClient, { TaxAPIClientOptions } from '../lib';

const defaultOpts: TaxAPIClientOptions = {
  cacheEnabled: true,
};
const client: TaxAPIClient = new TaxAPIClient(defaultOpts);

describe('TaxAPIClient Tests', () => {
  it('should get EU VAT rates', async () => {
    const results = await client.getVATRates();
    expect(results).toBeTruthy();
  });

  it('should get EU VAT rates by country', async () => {
    const results = await client.getVATRatesByCountryCode('ES');
    expect(results).toBeTruthy();
    expect(results.country_name).toBe('Spain');
  });

  it('should get US sales tax by Zip Code', async () => {
    const results = await client.getSalesTaxByZipCode('80521');
    expect(results).toBeTruthy();
    expect(results.state).toBe('CO');
  });

  it('should validate the Spotify VAT number', async () => {
    const results = await client.validateVATNumber('GB943684002');
    expect(results).toBeTruthy();
    expect(results.company_name).toBe('SPOTIFY LTD');
  });

  it('should cache values following initial retrieval', async () => {
    await client.getVATRates();
    expect(client.cacheClient.get('vatRates')).toBeTruthy();
  });

  afterEach(() => {
    if (client.cacheClient) {
      client.cacheClient.flushAll();
    }
  });
});
