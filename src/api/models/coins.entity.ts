import { Exclude } from 'class-transformer';
import { WalletController } from 'src/api/controller/wallets/wallet.controller';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Wallet } from './wallet.entity';

@Entity('coins')
export class Coins {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  quoteTo: string;

  @Column({ nullable: false })
  currentCoin: string;

  @Column({ nullable: false })
  value: number;

  @ManyToOne(() => Wallet, (wallet) => wallet.address)
  wallets: WalletController;

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
