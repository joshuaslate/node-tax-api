export interface SalesTaxByZipResponse {
  state: string;
  zipCode: string;
  taxRegionName: string;
  stateRate: number;
  estimatedCombinedRate: number;
  estimatedCountyRate: number;
  estimatedCityRate: number;
  estimatedSpecialRate: number;
  riskLevel: number;
};

export interface VATRatesResponseCountry {
  country_name: string;
  standard_rate: number;
  reduced_rates: {
    [s: string]: number;
  };
};

export interface VATRatesResponse {
  [s: string]: VATRatesResponseCountry;
};
