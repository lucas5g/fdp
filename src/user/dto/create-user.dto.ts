import { encrypt } from "@/utils/encrypt";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  username: string

  @ApiProperty()
  @IsString()
  @Transform(({ value }) => encrypt(value))
  password: string

  @ApiProperty()
  @IsOptional()
  name: string

  @ApiProperty()
  // @File()
  signature: File

  @ApiProperty()
  @IsOptional()
  masp: string
}
