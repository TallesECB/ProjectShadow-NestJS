import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Wallet } from './wallet.entity';
import { Transactions } from './transactions.entity';

@Entity('coin')
export class Coins {
  @PrimaryGeneratedColumn('uuid')
  idCoin: string;

  @Column({ nullable: false })
  coin: string;

  @Column({ nullable: false })
  fullname: string;

  @Column({ nullable: false, type: 'float', scale: 3 })
  amont: number;

  @ManyToOne(() => Wallet, (w) => w.coins, {
    onDelete: 'CASCADE',
    cascade: true
  })
  wallet: Wallet;
  coins: Wallet[];

  @OneToMany(() => Transactions, (t) => t.coins, {
    eager: true
  })
  transactions: Transactions[];

  @Exclude()
  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)', select: false })
  created_at: Date;

  @Exclude()
  @UpdateDateColumn({
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
    select: false
  })
  updated_at: Date;
}
