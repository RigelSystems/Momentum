import dayjs from 'dayjs';

export function getLastXDaysFormatted(days = 1, format = 'YYYY-MM-DD') {
  return Array.from({ length: days }, (_, i) =>
    dayjs().subtract(i, 'day').format(format)
  );
}
