import { dbPromise } from './db';

// 🔥 Intensity Logic: Architecture ke hisaab se coloring levels
const calculateIntensity = (score, time) => {
  if (score >= 100) return 4; // Perfect/Hard
  if (score >= 70) return 3;  // High effort
  if (score >= 40) return 2;  // Medium
  return 1;                   // Easy/Starter
};
export async function saveStats(stats) {
  const db = await dbPromise;
  await db.put('stats', { id: 'user', ...stats });
}

export async function loadStats() {
  const db = await dbPromise;
  return db.get('stats', 'user');
}

export async function markPlayed(date) {
  const db = await dbPromise;

  const stats = (await db.get('stats', 'user')) || {};

  const playedDays = stats.playedDays || [];

  if (!playedDays.includes(date)) {
    playedDays.push(date);
  }

  await db.put('stats', {
    id: 'user',
    ...stats,
    playedDays,
  });

  return playedDays;
}

export async function getHints() {
  const db = await dbPromise;
  const stats = (await db.get('stats', 'user')) || {};
  return stats.hintsLeft ?? 3;
}

export async function setHints(hintsLeft) {
  const db = await dbPromise;
  const stats = (await db.get('stats', 'user')) || {};
  await db.put('stats', { id: 'user', ...stats, hintsLeft });
}
// src/storage/statsStore.js
export async function updateStats(update, currentUser) {
  const db = await dbPromise;
  const dateKey = update.date;

  // --- STEP A: LOCAL UPDATE (IndexedDB) ---
  const intensity = calculateIntensity(update.score, update.time);
  
  const activityEntry = {
    date: dateKey,
    solved: true,
    score: update.score,
    timeTaken: update.time,
    intensity: intensity,
    synced: false 
  };

  // 1. Heatmap data save karein
  await db.put('dailyActivity', activityEntry);

  // 2. Aggregated stats update karein
  const stats = (await db.get('stats', 'user')) || { puzzlesSolved: 0, streak: 0 };
  const newSolvedCount = (stats.puzzlesSolved || 0) + 1;
  
  await db.put('stats', {
    id: 'user',
    ...stats,
    puzzlesSolved: newSolvedCount,
    lastPlayed: dateKey
  });

  // --- STEP B: CLOUD SYNC (Neon/Postgres) ---
  if (currentUser?.uid && navigator.onLine) { // 🔥 navigator.onLine check add kiya
    try {
      const response = await fetch(`${API_URL}/api/score/sync`, { // 🔥 Production-ready URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: currentUser.uid,
          email: currentUser.email,
          pointsToAdd: update.score || 100,
          time: update.time,
          date: update.date 
        }),
      });

      if (response.ok) {
        // Sync successful, mark as synced locally
        await db.put('dailyActivity', { ...activityEntry, synced: true });
        console.log("🔥 Neon DB Synced successfully!");
      }
    } catch (err) {
      console.warn("☁️ Sync failed: Saved locally. Will sync on next load.");
    }
  } else {
    console.warn("📴 Device is offline: Data kept in IndexedDB.");
  }

  return { puzzlesSolved: newSolvedCount };
}