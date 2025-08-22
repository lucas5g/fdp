import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/login-auth.dto';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { Public } from './decorators/public.decorator';
import { Auth } from './decorators/auth.decorator';
import { AuthEntity } from './entities/auth.entity';

@Controller('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiConsumes('application/x-www-form-urlencoded')
  login(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.login(createAuthDto);
  }

  @Get('me')
  me(@Auth() auth: AuthEntity) {
    return this.authService.me(auth);
  }
}
