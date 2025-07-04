import { ApiProperty } from '@nestjs/swagger';

export class FindAllPontoDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;
}
