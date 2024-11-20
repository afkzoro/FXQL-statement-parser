import { Test, TestingModule } from '@nestjs/testing';
import { FXQLParserService } from './app.service';
import { BadRequestException } from '@nestjs/common';

describe('FXQLParserService', () => {
  let service: FXQLParserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FXQLParserService],
    }).compile();

    service = module.get<FXQLParserService>(FXQLParserService);
  });

  describe('Valid Statements', () => {
    it('should parse statement with escaped newlines', () => {
      const result = service.parser('USD-GBP {\\n BUY 100\\n SELL 200\\n CAP 93800\\n}');
      expect(result[0]).toEqual({
        sourceCurrency: 'USD',
        destinationCurrency: 'GBP',
        buyRate: 100,
        sellRate: 200,
        transactionCap: 93800
      });
    });

    it('should parse statement with various whitespace formats', () => {
      const result = service.parser('EUR-USD {BUY 1.2 SELL 1.3 CAP 50000}');
      expect(result[0]).toEqual({
        sourceCurrency: 'EUR',
        destinationCurrency: 'USD',
        buyRate: 1.2,
        sellRate: 1.3,
        transactionCap: 50000
      });
    });
  });

  describe('Invalid Statements', () => {
    const invalidCases = [
      {
        input: 'usd-GBP {\\n BUY 100\\n SELL 200\\n CAP 93800\\n}',
        error: 'Invalid statement structure. Expected format: CURR1-CURR2 { ... }'
      },
      {
        input: 'USD-GBP {\\n BUY -100\\n SELL 200\\n CAP 93800\\n}',
        error: 'Missing or invalid BUY rate'
      },
      {
        input: 'USD-GBP {\\n BUY 100\\n SELL abc\\n CAP 93800\\n}',
        error: 'Missing or invalid SELL rate'
      },
      {
        input: 'USD-GBP {\\n BUY 100\\n SELL 200\\n CAP -1\\n}',
        error: 'Missing or invalid CAP amount'
      }
    ];

    invalidCases.forEach(({ input, error }) => {
      it(`should throw error for: ${error}`, () => {
        expect(() => service.parser(input)).toThrow(BadRequestException);
        try {
          service.parser(input);
        } catch (e) {
          expect(e.response.message).toContain(error);
          expect(e.response.code).toBe('FXQL-400');
        }
      });
    });
  });
});