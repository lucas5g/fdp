import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer'
import { Cookie } from 'playwright'

enum SameSite {
  Strict = 'Strict',
  Lax = 'Lax',
  None = 'None',
}

export class CreatePontoDto implements Cookie {
  @ApiProperty()
  @IsNotEmpty()
  value: string

  @IsOptional()
  name = 'JSESSIONID'

  @IsOptional()
  domain = 'azc.defensoria.mg.def.br'

  @IsOptional()

  path = '/azc'

  @IsOptional()
  expires = -1

  @IsOptional()
  httpOnly = true

  @IsOptional()
  secure = false

  @IsOptional()
  sameSite = SameSite.Lax
}
