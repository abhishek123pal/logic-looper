import dayjs from 'dayjs';

export function getDailySeed() {
  const today = dayjs().format('YYYY-MM-DD');

  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = today.charCodeAt(i) + ((hash << 5) - hash);
  }

  return Math.abs(hash);
}
