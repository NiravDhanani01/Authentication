import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  full_name: string;

  @Column({ unique: true })
  user_name: string;

  @Column({ unique: true })
  user_phone: string;

  @Column({ unique: true })
  user_email: string;

  @Column()
  user_password: string;
}
