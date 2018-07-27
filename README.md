# TaxiAPI.io Node Client
This is a wrapper for the free (but rate-limited) [TaxAPI.io](https://taxapi.io) API that allows users to get up-to-date U.S. sales tax and EU country VAT tax rates. Typings for TypeScript are included and exported.

## Usage
If you have ES6 module support, you can do the following:
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

// Validate VAT number for a given company
taxClient.validateVATNumber('GB943684002').then(response => console.log(response));
```

Otherwise, you will want to do this:
```js
const TaxApiClient = require('node-tax-api');

const taxClient = new TaxApiClient.default({ cacheEnabled: true });

// From here, the method usage will look the same.
```

## Caching
By default, results from these API calls are cached in-memory for one day. This is at the request of TaxAPI.io, due to the API being free. It is currently rate-limited at one request per second. If you would like to handle caching on your own, or just throw caution to the wind and not cache the results, pass `cacheEnabled: false` in the options you pass to the `TaxAPIClient` constructor.

Shameless plug regarding caching: I authored another library, [Type-Cacheable](https://github.com/joshuaslate/type-cacheable), which is the mechanism this library is using under the hood to cache the responses from TaxAPI.io. If you would like more fine-grained control over caching (using Redis rather than an in-memory cache, which would work better for a distributed system, for example), please consider using Type-Cacheable directly. To see how you can accomplish this, refer to the source code of this library.

### Note
Special thanks to [Abs Farah](https://twitter.com/absfarah) for creating this free API for tax information. Note that I am not the creator or maintainer of the API, just this convenience wrapper to access it with. I will try to keep this repository up to date with the API as I can. If you would like to contribute new features, bug fixes, or improvements, please open a pull request or issue. Please direct questions, comments, or concerns regarding the API itself to the API maintainer.