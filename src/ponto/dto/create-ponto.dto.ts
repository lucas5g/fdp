import { ApiProperty } from '@nestjs/swagger';

export class CreatePontoDto {
  @ApiProperty()
  username: string;
}
