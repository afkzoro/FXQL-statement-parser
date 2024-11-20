import { Injectable, BadRequestException } from '@nestjs/common';
import { FXQLParseResult } from './typings/custom.interface';

@Injectable()
export class FXQLParserService {
  private readonly CURRENCY_REGEX = /^[A-Z]{3}$/;
  private readonly NUMERIC_REGEX = /^(\d+(\.\d+)?)?$/;

  parser(statement: string): FXQLParseResult[] {
    // Clean up the input string
    const cleanStatement = statement
      .replace(/\\n/g, '\n') // Replace escaped newlines with actual newlines
      .trim();

    // Split the statement into individual rate blocks
    const rateBlocks = cleanStatement
      .split('\n\n')
      .map((block) => block.trim())
      .filter((block) => block.length > 0);

    if (rateBlocks.length > 1000) {
      throw new BadRequestException({
        message: 'Exceeded maximum number of currency pairs (1000)',
        code: 'FXQL-400',
      });
    }

    return rateBlocks.map((block) => this.parseSingleEntry(block));
  }

  private parseSingleEntry(block: string): FXQLParseResult {
    try {
      // Extract currencies
      const currencyMatch = block.match(
        /^([A-Z]{3})-([A-Z]{3})\s+\{([\s\S]*)\}$/,
      );
      if (!currencyMatch) {
        throw new Error(
          'Invalid statement structure. Expected format: CURR1-CURR2 { ... }',
        );
      }

      const [, sourceCurrency, destinationCurrency, rateContent] =
        currencyMatch;

      // Validate currencies
      this.validateCurrency(sourceCurrency);
      this.validateCurrency(destinationCurrency);

      // Extract rates using more flexible patterns
      const buyMatch = rateContent.match(/BUY\s+([0-9.]+)/i);
      const sellMatch = rateContent.match(/SELL\s+([0-9.]+)/i);
      const capMatch = rateContent.match(/CAP\s+([0-9]+)/i);

      if (!buyMatch) {
        throw new Error('Missing or invalid BUY rate');
      }
      if (!sellMatch) {
        throw new Error('Missing or invalid SELL rate');
      }
      if (!capMatch) {
        throw new Error('Missing or invalid CAP amount');
      }

      const buyRate = this.validateNumericRate(buyMatch[1], 'BUY');
      const sellRate = this.validateNumericRate(sellMatch[1], 'SELL');
      const transactionCap = this.validateTransactionCap(capMatch[1]);

      return {
        sourceCurrency,
        destinationCurrency,
        buyRate,
        sellRate,
        transactionCap,
      };
    } catch (error) {
      throw new BadRequestException({
        message: error.message,
        code: 'FXQL-400',
      });
    }
  }

  private validateCurrency(currency: string): void {
    if (!this.CURRENCY_REGEX.test(currency)) {
      throw new Error(
        `Invalid currency format: ${currency}. Must be 3 uppercase letters.`,
      );
    }
  }

  private validateNumericRate(rate: string, type: 'BUY' | 'SELL'): number {
    if (!this.NUMERIC_REGEX.test(rate)) {
      throw new Error(
        `Invalid ${type} rate format: ${rate}. Must be a positive number.`,
      );
    }

    const numericRate = parseFloat(rate);
    if (numericRate <= 0) {
      throw new Error(`Invalid ${type} rate: ${rate}. Must be greater than 0.`);
    }

    return numericRate;
  }

  private validateTransactionCap(cap: string): number {
    const parsedCap = parseInt(cap, 10);
    if (isNaN(parsedCap) || parsedCap < 0) {
      throw new Error(
        `Invalid transaction cap: ${cap}. Must be a non-negative integer.`,
      );
    }
    return parsedCap;
  }
}
