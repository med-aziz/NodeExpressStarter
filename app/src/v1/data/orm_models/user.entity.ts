import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ResetPasswordEntity } from './resetpassword.entity';
import { QueryDeepPartialEntity, WhereEntityOptions, findManyType } from '../../../types/repos';

@Entity({
  name: 'Users',
})
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
  })
  email: string;

  @Column({
    type: 'varchar',
  })
  password: string;

  @Column({
    type: 'varchar',
  })
  first_name: string;

  @Column({
    type: 'varchar',
  })
  last_name: string;

  @Column({
    type: 'varchar',
  })
  confirmation_token: string;

  @Column({
    type: 'varchar',
  })
  picture: string;

  @Column({
    type: 'bool',
  })
  confirmed_email: boolean;

  @OneToMany(() => ResetPasswordEntity, (resetPassword) => resetPassword.user)
  resetPasswords: ResetPasswordEntity[];

  @DeleteDateColumn({ name: 'deletedAt' })
  deletedAt: Date;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
}

export type UsersWherePayload = WhereEntityOptions<UserEntity>;
export type UsersUpadteDataPayload = QueryDeepPartialEntity<UserEntity>;
export type UsersFindPayload = findManyType<UserEntity>;
