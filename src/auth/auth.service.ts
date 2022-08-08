import {
  forwardRef,
  Inject,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './type/jwt-payload.type';
import { Tokens } from './type/tokens.type';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async hashData(data: string) {
    const salt = await bcrypt.genSalt(+process.env.CRYPT_SALT);
    return bcrypt.hash(data, salt);
  }

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<Tokens> {
    const { login, password } = authCredentialsDto;
    const hashedPassword = await this.hashData(password);

    const user = await this.usersService.create({
      login,
      password: hashedPassword,
    });
    const tokens = await this.getTokens(user.id, user.login);
    await this.updateRtHash(user.id, tokens.refreshToken);
    return tokens;
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<Tokens> {
    const { login, password } = authCredentialsDto;
    const user = await this.usersService.findOneByName(login);
    const id = user.id;
    if (!user) throw new ForbiddenException('Access Denied');
    const passwordMatches = bcrypt.compare(password, user.password);
    if (!passwordMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(id, login);
    await this.updateRtHash(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(id: string) {
    const user = await this.usersService.findOne(id);
    if (user.hashRt) await this.usersService.updateHashRt(id, null);
  }
  async refreshTokens(id: string, rt: string) {
    const user = await this.usersService.findOne(id);
    if (!user) throw new ForbiddenException('Access Denied');
    if (!user.hashRt) throw new ForbiddenException('Access Denied');
    const rtMatches = await bcrypt.compare(rt, user.hashRt);
    if (!rtMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(id, user.login);
    await this.updateRtHash(id, tokens.refreshToken);
    return tokens;
  }
  async getTokens(id: string, login: string): Promise<Tokens> {
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
  }

  async updateRtHash(userId: string, rt: string): Promise<void> {
    const hash = await this.hashData(rt);
    await this.usersService.updateHashRt(userId, hash);
  }
}
