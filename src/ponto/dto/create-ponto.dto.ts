import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer'
import {type Cookie} from 'playwright'
export class CreatePontoDto {
  @ApiProperty()
  @IsNotEmpty()
  // @Type(() => Object)
  @Transform(({ value }) => {
    const data = JSON.parse(value)
    console.log({ data })
    return data
  })
  cookie:Cookie[]
}
