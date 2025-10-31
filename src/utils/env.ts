import { z } from 'zod';
import 'dotenv/config';

export const env = z
  .object({
    USER_NAME: z.string().optional(),
    USER_PASSWORD: z.string().optional(),
    RECORD_HOURS: z.string().transform((value) => value === 'true'),
    JWT_SECRET: z.string(),
    SECRET_KEY: z.string().length(32),
    DATABASE_URL: z.string(),
    DISCORD_CLIENT_ID: z.string(),
    DISCORD_BOT_TOKEN: z.string(),
    // REDIS_URL: z.string().url(),
  })
  .parse(process.env);
