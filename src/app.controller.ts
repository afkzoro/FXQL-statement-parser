import { Controller, Post, Body } from '@nestjs/common';
import { FXQLParserService } from './app.service';
import { ExchangeRateRepository } from './app.repository';
import { FXQLRequest, FXQLResponse } from './typings/custom.interface';

@Controller('fxql')
export class FXQLController {
  constructor(
    private readonly fxqlParserService: FXQLParserService,
    private readonly exchangeRateRepository: ExchangeRateRepository,
  ) {}

  @Post()
  async processFXQL(@Body() request: FXQLRequest): Promise<FXQLResponse> {
    // Parse multiple exchange rate entries
    const parsedResults = this.fxqlParserService.parser(request.FXQL);

    // Store each parsed result in the database
    const storedRates = await Promise.all(
      parsedResults.map((result) =>
        this.exchangeRateRepository.create({
          sourceCurrency: result.sourceCurrency,
          destinationCurrency: result.destinationCurrency,
          buyPrice: result.buyRate,
          sellPrice: result.sellRate,
          capAmount: result.transactionCap,
        }),
      ),
    );

    // Map stored rates to response format
    const responseData = storedRates.map((rate) => ({
      EntryId: rate.id,
      SourceCurrency: rate.sourceCurrency,
      DestinationCurrency: rate.destinationCurrency,
      SellPrice: rate.sellPrice,
      BuyPrice: rate.buyPrice,
      CapAmount: rate.capAmount,
    }));

    return {
      message: 'FXQL Statement Parsed Successfully.',
      code: 'FXQL-200',
      data: responseData,
    };
  }
}
