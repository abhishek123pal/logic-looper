import { useState, useEffect } from 'react';
import { loadStats, saveStats } from '../storage/statsStore';

export default function useStreak() {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function run() {
      const stats = await loadStats();
      const today = new Date().toISOString().split('T')[0];

      if (!mounted) return;

      if (!stats) {
        await saveStats({ streak: 1, lastPlayed: today });
        setStreak(1);
        return;
      }

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const y = yesterday.toISOString().split('T')[0];

      if (stats.lastPlayed === today) {
        setStreak(stats.streak);
      } else if (stats.lastPlayed === y) {
        const s = stats.streak + 1;
        await saveStats({ streak: s, lastPlayed: today });
        setStreak(s);
      } else {
        await saveStats({ streak: 1, lastPlayed: today });
        setStreak(1);
      }
    }

    run();
    return () => (mounted = false);
  }, []);

  return streak;
}






























/*import { useState, useEffect } from 'react';
import { loadStats, saveStats } from '../storage/statsStore';

export default function useStreak() {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function run() {
      const stats = await loadStats();
      const today = new Date().toISOString().split('T')[0];

      if (!mounted) return;

      if (!stats) {
        await saveStats({ streak: 1, lastPlayed: today });
        if (mounted) setStreak(1);
        return;
      }

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const y = yesterday.toISOString().split('T')[0];

      if (stats.lastPlayed === today) {
        setStreak(stats.streak);
      } else if (stats.lastPlayed === y) {
        const s = stats.streak + 1;
        await saveStats({ streak: s, lastPlayed: today });
        if (mounted) setStreak(s);
      } else {
        await saveStats({ streak: 1, lastPlayed: today });
        if (mounted) setStreak(1);
      }
    }

    run();

    return () => {
      mounted = false;
    };
  }, []);

  return streak;
}
*/