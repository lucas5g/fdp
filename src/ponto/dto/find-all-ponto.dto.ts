import { ApiProperty } from '@nestjs/swagger';

export class FindAllPontoDto {
  @ApiProperty()
  username: string;

  @ApiProperty({
    format: 'password',
  })
  password: string;
}
