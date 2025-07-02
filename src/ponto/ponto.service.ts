import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePontoDto } from './dto/create-ponto.dto';
import { UpdatePontoDto } from './dto/update-ponto.dto';

@Injectable()
export class PontoService {
  create(createPontoDto: CreatePontoDto) {
    return 'This action adds a new ponto';
  }

  findAll() {
    return `This action returns all ponto`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ponto`;
  }

  findByUsername(username:string){
    if(username !== 'lucasdesousa3885'){
      throw new NotFoundException('Usuário não encontrado')
    }
   
    https://azc.defensoria.mg.def.br/arte/auraarteweb?credentials=00020aarte0alucas.assuncao0aarte0alucas.assuncao0aarte0a12WWQE%3C53Z0aarte0a2025-07-01%20(18:36)&relat=.F00&codigoLayout=xxxx
    

  }

  update(id: number, updatePontoDto: UpdatePontoDto) {
    return `This action updates a #${id} ponto`;
  }

  remove(id: number) {
    return `This action removes a #${id} ponto`;
  }
}
