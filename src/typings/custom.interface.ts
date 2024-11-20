export interface FXQLRequest {
  FXQL: string;
}

export interface FXQLResponse {
  message: string;
  code: string;
  data: Array<{
    EntryId: number;
    SourceCurrency: string;
    DestinationCurrency: string;
    SellPrice: number;
    BuyPrice: number;
    CapAmount: number;
  }>;
}

export interface FXQLParseResult {
  sourceCurrency: string;
  destinationCurrency: string;
  buyRate: number;
  sellRate: number;
  transactionCap: number;
}
