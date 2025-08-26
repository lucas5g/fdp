import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiExcludeEndpoint } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('signature'))
  create(@Body() dto: CreateUserDto, @UploadedFile() file: Express.Multer.File) {
    return this.userService.create({ ...dto, signature: file ? file.buffer : undefined });
  }

  @Get()
  @ApiExcludeEndpoint()

  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Get(':id/signature')
  async findOneSignature(@Param('id') id: number) {
    // const user 
    // return this.userService.findOneSignature(+id);
  }


  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('signature'))
  update(
    @Param('id') id: number,
    @Body() dto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.userService.update(id, { ...dto, signature: file ? file.buffer : undefined });
  }

  @ApiExcludeEndpoint()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
