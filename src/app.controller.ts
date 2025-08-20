import { Controller, Get, Redirect } from '@nestjs/common';
import { Public } from './auth/decorators/public.decorator';

@Controller()
export class AppController {
  @Get()
  @Redirect('/doc')
  @Public()
  home() {
    return { api: 'fdp' };
  }
}
