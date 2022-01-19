import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Coins } from './coins.entity';

@Entity('wallet')
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  address: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, unique: true })
  cpf: string;

  @Column({ type: 'date', nullable: false })
  birthdate: Date;

  @OneToMany(() => Coins, (c) => c.wallet, {
    eager: true
  })
  coins: Coins[];

  @Exclude()
  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)' })
  created_at: Date;

  @Exclude()
  @UpdateDateColumn({
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)'
  })
  updated_at: Date;
}
