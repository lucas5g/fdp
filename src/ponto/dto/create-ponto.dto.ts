import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePontoDto {
  @ApiProperty()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    format: 'password',
  })
  @IsNotEmpty()
  password: string;
}
