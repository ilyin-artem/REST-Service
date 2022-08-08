import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  login: string;

  @Column()
  password: string;

  @Column()
  version: number;

  @Column()
  createdAt: number;

  @Column()
  updatedAt: number;

  @Column()
  hashRt: string | null;

  toResponse() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...response } = this;
    return response;
  }
}
