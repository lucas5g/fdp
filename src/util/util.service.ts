import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import { z } from 'zod';
import 'dotenv/config'
import { chromium } from 'playwright';

@Injectable()
export class UtilService {

  env() {
    return z.object({
      DISCORD_TOKEN: z.string(),
      DISCORD_CLIENT_ID: z.string(),
      AZC_TOKEN: z.string(),
      DISCORD_ONLINE: z.string().transform((value) => value === 'true'),
    }).parse(process.env);
  }

  getUrlPoint(username: string) {

    const date = format(new Date(), 'yyyy-MM-dd')

    const hours = format(new Date(), 'HH:mm')


    return `https://azc.defensoria.mg.def.br/arte/auraarteweb?credentials=00020aarte0a${username}0aarte0alucas.assuncao${this.env().AZC_TOKEN}${date}%20(${hours})&relat=.F00&codigoLayout=xxxx`
  }

  crawler(){
    

  }
}
