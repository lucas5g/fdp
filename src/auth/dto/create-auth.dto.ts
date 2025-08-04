import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    format: 'password',
  })
  @IsNotEmpty()
  password: string;
}
