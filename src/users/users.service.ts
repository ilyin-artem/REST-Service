import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(
    createUserDto: CreateUserDto,
  ): Promise<Omit<UserEntity, 'password' | 'toResponse'>> {
    const createdTime = Date.now();
    const newUser = {
      ...createUserDto,
      version: 1,
      createdAt: createdTime,
      updatedAt: createdTime,
    };
    const user = this.userRepository.create(newUser);
    return (await this.userRepository.save(user)).toResponse();
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async findOne(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (user) return user;
    throw new NotFoundException();
  }

  async update(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<Omit<UserEntity, 'password' | 'toResponse'>> {
    const updatedAt = Date.now();
    const user = await this.userRepository.findOne({ where: { id } });
    if (user) {
      if (user.password !== updatePasswordDto.oldPassword)
        throw new ForbiddenException('oldPassword is wrong');
      return (
        await this.userRepository.save(
          this.userRepository.create({
            ...user,
            password: updatePasswordDto.newPassword,
            version: user.version + 1,
            createdAt: +user.createdAt,
            updatedAt: updatedAt,
          }),
        )
      ).toResponse();
    }
    throw new NotFoundException();
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException();
    }
  }
}
