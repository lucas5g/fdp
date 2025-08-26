import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { env } from '@/utils/env';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: env.JWT_SECRET ?? 'secret',
      // signOptions: { expiresIn: '1d' },
      global: true,
    }),
  ],
  controllers: [AuthController],

  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}
