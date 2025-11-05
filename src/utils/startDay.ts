import { startOfToday, sub } from 'date-fns';

export function startDay() {
  return sub(startOfToday(), { hours: 3 });
}
