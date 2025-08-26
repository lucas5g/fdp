import { env } from '@/utils/env';
import { createCipheriv, randomBytes } from 'node:crypto';

export function encrypt(plainText: string): string {
  const iv = randomBytes(16);
  const cipher = createCipheriv('aes-256-cbc', env.SECRET_KEY, iv);
  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}
