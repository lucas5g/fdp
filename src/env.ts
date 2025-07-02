import { z } from "zod";
import 'dotenv/config';

export const env = z.object({
  DISCORD_TOKEN: z.string(),
  DISCORD_CLIENT_ID: z.string(),    
}).parse(process.env);