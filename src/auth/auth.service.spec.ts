import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UtilService } from "@/util/util.service";
import { log } from "console";
import { env } from "@/env";
import { PrismaService } from "@/prisma/prisma.service";
import { AuthEntity } from "./entities/auth.entity";
import { authData } from "./auth-data";


describe('AuthService', () => {

  let service: AuthService;
  let auth: AuthEntity;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UtilService, PrismaService],
    }).compile();

    const moduleUtil: TestingModule = await Test.createTestingModule({
      providers: [UtilService],
    }).compile();

    service = module.get<AuthService>(AuthService);

    const { value } = await service.login({
      username: env.USER_NAME,
      password: env.USER_PASSWORD 
    })

    auth = authData(value);

    
  }, 5500);

  it.only('me', async() => {


    const res = await service.me(auth);

    console.log(res);
  })
})