enum SameSite {
  Strict = 'Strict',
  Lax = 'Lax',
  None = 'None',
}
export function authData(value: string) {
  return {
    value,
    name: 'JSESSIONID',
    domain: 'azc.defensoria.mg.def.br',
    path: '/azc',
    expires: -1,
    httpOnly: true,
    secure: false,
    sameSite: SameSite.Lax,
  };
}
