import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginPontoDto {
  @ApiProperty()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    format: 'password',
  })
  @IsNotEmpty()
  password: string;
}
