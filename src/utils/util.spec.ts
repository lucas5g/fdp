import { encrypt } from './encrypt';
import { decrypt } from './decrypt';
import { setEnd } from './set-end';

describe('Util', () => {
  it('encrypt and decrypt', () => {
    const text = 'test-123';
    const res = encrypt(text);

    const decrypted = decrypt(res);

    expect(res).toHaveLength(65);
    expect(decrypted).toContain(text);
  });

  it('setHourEnd', () => {
    const res = setEnd('09:00', '12:00', '13:02');

    expect(res).toBe('18:02');
  });
});
