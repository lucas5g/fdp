import { LoginAuthDto } from '@/auth/dto/login-auth.dto';
import axios, { AxiosError } from 'axios';
import qs from 'qs';

export async function loginSecurityCheck(dto: LoginAuthDto): Promise<string> {
  try {
    const {
      data,
    }: {
      data: string;
    } = await axios.post(
      'https://azc.defensoria.mg.def.br/azc/j_security_check',
      qs.stringify({
        j_username: dto.username,
        j_password: dto.password,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const cookie = error.response?.headers['set-cookie']?.[0] ?? '';
      return cookie.split(/=|;/g)[1];
    }
    return 'Ocorreu um erro ao fazer o login';
  }
}
