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
  })
  .parse(process.env);
