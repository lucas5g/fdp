export function getDayDetail(day: string, start: string) {
  if (day === 'SÁBADO' || day === 'DOMINGO') {
    return 'FOLGA';
  }

  if (start === '') {
    return 'FERIADO';
  }

  return 'TRABALHO';
}
