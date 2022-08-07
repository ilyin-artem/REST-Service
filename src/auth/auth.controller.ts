import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { Public } from 'src/config/decorators/public.decorator';
import { JwtRefreshGuard } from 'src/guards/jwt-refresh.guard';
import { Tokens } from './type/tokens.type';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  singUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<Tokens> {
    return this.authService.signUp(authCredentialsDto);
  }
  @Public()
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  singIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDto);
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  logout(@Req() req: Request) {
    const user = req.user;

    return this.authService.logout(user['id']);
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(@Req() req: Request) {
    const user = req.user;
    return this.authService.refreshTokens(user['id'], user['refreshToken']);
  }
}
