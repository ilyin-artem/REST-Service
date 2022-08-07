import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<any> {
    const { login, password } = authCredentialsDto;
    const salt = await bcrypt.genSalt();

    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.usersService.create({
      login,
      password: hashedPassword,
    });
    // todo убрать
    return [login, password, hashedPassword];
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { login, password } = authCredentialsDto;
    const user = await this.usersService.findOneByName(login);
    const id = user.id;

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { id, login };
      const accessToken: string = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: process.env.TOKEN_EXPIRE_TIME,
      });
      const refreshToken: string = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
      });
      return { accessToken, refreshToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }
}
