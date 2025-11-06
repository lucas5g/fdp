import { format } from 'date-fns';

export interface TimePartsInterface {
  start?: string | null;
  lunchStart?: string | null;
  lunchEnd?: string | null;
  end?: string | null;
}
export function getHoursWorked({
  start,
  lunchStart,
  lunchEnd,
  end,
}: TimePartsInterface): string {
  const toMinutes = (time: string | null | undefined) => {
    const hoursSplit = time || format(new Date(), 'HH:mm');
    const [hours, minutes] = hoursSplit.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const startMinutes = toMinutes(start);
  const lunchStartMinutes = toMinutes(lunchStart);
  const lunchEndMinutes = toMinutes(lunchEnd);
  const endMinutes = toMinutes(end);

  const workedMinutes =
    lunchStartMinutes - startMinutes + (endMinutes - lunchEndMinutes);
  const hoursWorked = Math.floor(workedMinutes / 60);
  const minutesWorked = workedMinutes % 60;

  return `${String(hoursWorked).padStart(2, '0')}:${String(minutesWorked).padStart(2, '0')}`;
}
