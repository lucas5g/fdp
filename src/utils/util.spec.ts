import { encrypt } from './encrypt';
import { decrypt } from './decrypt';
import { setEnd } from './set-end';
import { newDate } from './new-date';
import { startDay } from './startDay';
import { getHoursWorked, TimePartsInterface } from './get-hours-worked';

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

  it('newDate', () => {
    const utilDate = newDate();

    expect(utilDate).toBeInstanceOf(Date);
  });

  it('startDay', () => {
    const res = startDay();
    expect(res).toBeInstanceOf(Date);
  });

  it('getHoursWorked', () => {
    const data: TimePartsInterface = {
      start: '09:00',
      lunchStart: '12:00',
      lunchEnd: '13:00',
      end: '18:00',
    };

    const res = getHoursWorked(data);

    expect(res).toBe('08:00');
  });
});
