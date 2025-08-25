import { z } from 'zod';
import 'dotenv/config';

export const env = z
  .object({
    DISCORD_TOKEN: z.string(),
    DISCORD_CLIENT_ID: z.string(),
    AZC_TOKEN: z.string(),
    DISCORD_ONLINE: z.string().transform((value) => value === 'true'),
    USER_NAME: z.string(),
    USER_PASSWORD: z.string(),
    RECORD_HOURS: z.string().transform((value) => value === 'true'),
    JWT_SECRET: z.string(),
    SECRET_KEY: z.string().length(32),
    DATABASE_URL: z.string(),
  })
  .parse(process.env);
