import { Controller, Get, Redirect } from '@nestjs/common';
import { Public } from './auth/decorators/public.decorator';
import { ApiExcludeController } from '@nestjs/swagger';

@Controller()
@ApiExcludeController()
export class AppController {
  @Get()
  @Redirect('/doc')
  @Public()
  home() {
    return { api: 'fdp' };
  }

  @Get('notify')
  @Public()
  notify() {
    return { message: 'Notified!' };
  }
}
