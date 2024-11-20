import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('exchange_rates')
export class ExchangeRate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 3 })
  sourceCurrency: string;

  @Column({ length: 3 })
  destinationCurrency: string;

  @Column('decimal', { precision: 10, scale: 4 })
  buyPrice: number;

  @Column('decimal', { precision: 10, scale: 4 })
  sellPrice: number;

  @Column('integer')
  capAmount: number;
}
