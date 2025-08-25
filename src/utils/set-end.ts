export function setEnd(start: string, lunchStart: string, lunchEnd: string) {
  const [hourStart, minuteStart] = start.split(':');
  const [hourLunchStart, minuteLunchStart] = lunchStart.split(':');
  const [hourLunchEnd, minuteLunchEnd] = lunchEnd.split(':');

  const startNumber = Number(hourStart) * 60 + Number(minuteStart);
  const lunchStartNumber = Number(hourLunchStart) * 60 + Number(minuteLunchStart);
  const lunchEndNumber = Number(hourLunchEnd) * 60 + Number(minuteLunchEnd);

  const heightHour = 480

  const endNumber = startNumber + (lunchEndNumber - lunchStartNumber) + heightHour


  const hours = Math.floor(endNumber / 60);
  const minutes = endNumber % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

