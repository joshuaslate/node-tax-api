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

export interface VATNumberValidationResponse {
  valid: boolean;
  format_valid: boolean;
  query: boolean;
  country_code: string;
  vat_number: string;
  company_name: string;
  company_address: string;
};
