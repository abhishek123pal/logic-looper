import { expect, test } from 'vitest';
import dayjs from 'dayjs';

// Ye function simulate kar raha hai aapke logic ko
function calculateStreak(playedDays) {
  if (!playedDays || playedDays.length === 0) return 0;
  
  let streak = 0;
  let today = dayjs().format('YYYY-MM-DD');
  
  // Sort days to check backwards
  const sortedDays = [...playedDays].sort((a, b) => dayjs(b).diff(dayjs(a)));
  
  // Agar aaj nahi khela, toh streak 0 (ya purani streak agar aap allow karein)
  if (sortedDays[0] !== today) return 0;

  for (let i = 0; i < sortedDays.length; i++) {
    const current = dayjs(sortedDays[i]);
    const next = dayjs(today).subtract(i, 'day');
    
    if (current.isSame(next, 'day')) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

test('Streak should be 2 if played today and yesterday', () => {
  const today = dayjs().format('YYYY-MM-DD');
  const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
  
  const playedDays = [today, yesterday];
  expect(calculateStreak(playedDays)).toBe(2);
});

test('Streak should be 0 if today is skipped', () => {
  const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
  const playedDays = [yesterday];
  expect(calculateStreak(playedDays)).toBe(0);
});