import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { User } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  private users: User[] = [];

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const createdTime = Date.now();
    const newUser = {
      id: uuidv4(),
      ...createUserDto,
      version: 1,
      createdAt: createdTime,
      updatedAt: createdTime,
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...responseUser } = newUser;
    this.users.push(newUser);
    return responseUser;
  }

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async findOne(id: string): Promise<User> {
    const user = this.users.find((user) => id === user.id);
    if (user) return user;
    throw new NotFoundException();
  }

  async update(
    id: string,
    UpdatePasswordDto: UpdatePasswordDto,
  ): Promise<Omit<User, 'password'>> {
    let updatedUser: User | null = null;
    const updatedAt = Date.now();
    const user = this.users.find((user) => id === user.id);
    if (user) {
      if (user.password !== UpdatePasswordDto.oldPassword)
        throw new ForbiddenException('oldPassword is wrong');
      this.users = this.users.map((user) =>
        user.id === id
          ? (updatedUser = {
              ...user,
              password: UpdatePasswordDto.newPassword,
              version: user.version + 1,
              updatedAt,
            })
          : user,
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...responseUser } = updatedUser;
      return responseUser;
    }
    throw new NotFoundException();
  }

  async remove(id: string): Promise<User> {
    const user = this.users.find((user) => id === user.id);
    if (user) {
      this.users = this.users.filter((user) => user.id !== id);
      return;
    }
    throw new NotFoundException();
  }
}
