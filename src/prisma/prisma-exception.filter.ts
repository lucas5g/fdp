import { BadRequestException, Catch, ExceptionFilter, InternalServerErrorException } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: PrismaClientKnownRequestError) {

    if(exception.code === 'P2002') {
      throw new BadRequestException(`${exception.meta?.modelName} already exists`)
    }
   

    throw new InternalServerErrorException('Erro database')
    
  }
}