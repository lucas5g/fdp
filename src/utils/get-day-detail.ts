export function getDayDetail(data: { dayWeek: string, start: string, day: number }) {

  if ([5, 6].includes(data.day)) {
    return 'PLANTÃO';
  }

  if ([1, 2].includes(data.day)) {
    return 'RECESSO';
  }
  if (data.dayWeek === 'SÁBADO' || data.dayWeek === 'DOMINGO') {
    return 'FOLGA';
  }

  if (data.start === '') {
    return 'FERIADO';
  }

  return 'TRABALHO';
}
