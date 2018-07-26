# TaxiAPI.io Node Client
This is a wrapper for the free (but rate-limited) TaxAPI.io API that allows users to get up-to-date U.S. sales tax and EU country VAT tax rates.

## Usage
```ts
import TaxAPIClient, { TaxAPIClientOptions } from 'node-tax-api';

const taxClientOptions: TaxAPIClientOptions = {
  cacheEnabled: true, // This is the default value, as TaxAPI.io best practices indicate results should be cached for one day.
};

// Set up client
const taxClient = new TaxAPIClient(taxClientOptions);

// Get sales tax by U.S. postal code
taxClient.getSalesTaxByZipCode('80521').then(response => console.log(response));

// Get VAT for all EU countries
taxClient.getVATRates().then(response => console.log(response));

// Get VAT for a single EU country
taxClient.getVATRatesByCountryCode('ES').then(response => console.log(response));
```

## Caching
By default, results from these API calls are cached in-memory for one day. This is at the request of TaxAPI.io, due to the API being free. It is currently rate-limited at one request per second. If you would like to handle caching on your own, or just throw caution to the wind and not cache the results, pass `cacheEnabled: false` in the options you pass to the `TaxAPIClient` constructor.