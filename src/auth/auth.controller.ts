import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { Public } from './decorators/public.decorator';
import { Auth } from './decorators/auth.decorator';
import { AuthEntity } from './entities/auth.entity';
import { LoginAuthDto } from '@/auth/dto/login-auth.dto';

@Controller('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiConsumes('application/x-www-form-urlencoded')
  login(@Body() dto: LoginAuthDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  me(@Auth() auth: AuthEntity) {
    return this.authService.me(auth);
  }
}
