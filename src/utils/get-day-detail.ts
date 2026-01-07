export function getDayDetail(data: { dayWeek: string, start: string, day: number }) {

  if ([22, 23, 29, 30].includes(data.day)) {
    return 'PLANTÃO';
  }

  if ([24, 25, 26, 31].includes(data.day)) {
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
