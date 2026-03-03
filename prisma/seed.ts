import { encrypt } from '@/utils/encrypt'
import { env } from '@/utils/env'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
async function main() {
  await prisma.user.create({
    data: {
      // name: "Lucas",
      username: env.USER_NAME!,
      password: encrypt(env.USER_PASSWORD!)
    }
  })
}

main()