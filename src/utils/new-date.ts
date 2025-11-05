import { sub } from 'date-fns';

export function newDate(): Date {
  return sub(new Date(), { hours: 3 });
}
