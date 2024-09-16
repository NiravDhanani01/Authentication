import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './user.entity';

@Entity()
export class Tokens {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  refresh_token: string;

  @OneToOne(() => Users)
  @JoinColumn({ name: 'user_id' })
  user: Users;
}
