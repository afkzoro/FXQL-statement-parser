import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ExchangeRate } from './entitities/fxql.entity';

@Injectable()
export class ExchangeRateRepository {
  constructor(
    @InjectRepository(ExchangeRate)
    private readonly repository: Repository<ExchangeRate>,
  ) {}

  async create(exchangeRate: Partial<ExchangeRate>): Promise<ExchangeRate> {
    const newRate = this.repository.create(exchangeRate);
    return this.repository.save(newRate);
  }
}
