import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

enum SameSite {
  Strict = 'Strict',
  Lax = 'Lax',
  None = 'None',
}

export const Auth = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user: { value: string } }>();
    return {
      value: request.user.value,
      name: 'JSESSIONID',
      domain: 'azc.defensoria.mg.def.br',
      path: '/azc',
      expires: -1,
      httpOnly: true,
      secure: false,
      sameSite: SameSite.Lax,
    };
  },
);
