import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Coins } from './coins.entity';

@Entity('transactions')
export class Transactions {
  @PrimaryGeneratedColumn('uuid')
  idTransaction: string;

  @Column({ nullable: false, type: 'float', scale: 3 })
  value: number;

  @Column({ nullable: false })
  datetime: Date;

  @Column({ nullable: false })
  sendTo: string;

  @Column({ nullable: false })
  receiveFrom: string;

  @Column({ nullable: false, type: 'float', scale: 3 })
  currentCotation: number;

  @ManyToOne(() => Coins, (c) => c.transactions, {
    onDelete: 'CASCADE',
    cascade: true
  })
  coins: Coins;
  transactions: Coins[];
}
